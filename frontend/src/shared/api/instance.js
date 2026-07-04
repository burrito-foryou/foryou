import axios from "axios";
import useAuthStore from "../../features/auth/store/authStore";
import { isTokenExpired } from "../../features/auth/utils/tokenExpiry";

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 재발급 전용 클라이언트 - 인터셉터를 타지 않아야 무한 재시도를 막을 수 있음
const reissueClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const logoutAndRedirect = () => {
  useAuthStore.getState().clearAuth();
  window.location.href = "/login";
};

let isReissuing = false;
let pendingRequests = [];

const resolvePendingRequests = (newToken) => {
  pendingRequests.forEach((resolve) => resolve(newToken));
  pendingRequests = [];
};

// refresh token으로 access token 재발급. 동시에 여러 요청이 몰리면 하나의 재발급 결과를 공유한다.
// refresh token이 없거나 재발급 자체가 실패하면 로그아웃 처리 후 null을 반환한다.
const reissueAccessToken = async () => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    logoutAndRedirect();
    return null;
  }

  if (isReissuing) {
    return new Promise((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  isReissuing = true;

  try {
    const { data } = await reissueClient.post("/auth/reissue", {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = data.data;

    useAuthStore.getState().setAuth(accessToken, newRefreshToken);
    resolvePendingRequests(accessToken);
    return accessToken;
  } catch {
    resolvePendingRequests(null);
    logoutAndRedirect();
    return null;
  } finally {
    isReissuing = false;
  }
};

// 요청 인터셉터 - 토큰 자동 첨부. access token이 만료된 경우 요청을 보내기 전에 선제적으로 재발급을 시도한다.
instance.interceptors.request.use(async (config) => {
  const { token, expiresAt } = useAuthStore.getState();

  if (!token) {
    return config;
  }

  if (!isTokenExpired(expiresAt)) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  const newToken = await reissueAccessToken();
  if (!newToken) {
    return Promise.reject(new Error("세션이 만료되어 로그아웃되었습니다."));
  }

  config.headers.Authorization = `Bearer ${newToken}`;
  return config;
});

// 응답 인터셉터 - 401 시 토큰 재발급 후 재시도, 실패 시 로그아웃 처리
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && config && !config._retry) {
      config._retry = true;

      const newToken = await reissueAccessToken();
      if (!newToken) {
        return Promise.reject(error);
      }

      config.headers.Authorization = `Bearer ${newToken}`;
      return instance(config);
    }

    if (response?.status === 500) {
      console.error("서버 오류 : ", response.data?.message);
    }
    if (error.isAxiosError && !response) {
      console.error("네트워크 오류 : 서버에 연결할 수 없습니다.");
    }
    return Promise.reject(error);
  },
);

export default instance;
