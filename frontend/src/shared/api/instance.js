import axios from "axios";
import useAuthStore from "../../features/auth/store/authStore";

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

// 요청 인터셉터 - 토큰 자동 첨부
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

// 응답 인터셉터 - 401 시 토큰 재발급 후 재시도, 실패 시 로그아웃 처리
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && config && !config._retry) {
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        logoutAndRedirect();
        return Promise.reject(error);
      }

      config._retry = true;

      if (isReissuing) {
        const newToken = await new Promise((resolve) => {
          pendingRequests.push(resolve);
        });

        if (!newToken) {
          return Promise.reject(error);
        }

        config.headers.Authorization = `Bearer ${newToken}`;
        return instance(config);
      }

      isReissuing = true;

      try {
        const { data } = await reissueClient.post("/auth/reissue", {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = data.data;

        useAuthStore.getState().setAuth(accessToken, newRefreshToken);
        resolvePendingRequests(accessToken);

        config.headers.Authorization = `Bearer ${accessToken}`;
        return instance(config);
      } catch (reissueError) {
        resolvePendingRequests(null);
        logoutAndRedirect();
        return Promise.reject(reissueError);
      } finally {
        isReissuing = false;
      }
    }

    if (response?.status === 500) {
      console.error("서버 오류 : ", response.data?.message);
    }
    if (!response) {
      console.error("네트워크 오류 : 서버에 연결할 수 없습니다.");
    }
    return Promise.reject(error);
  },
);

export default instance;
