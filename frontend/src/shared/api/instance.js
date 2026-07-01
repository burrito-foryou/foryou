import axios from "axios";
import useAuthStore from "../../features/auth/store/authStore";

const instance = axios.create({
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

// 응답 인터셉터 - 401 시 로그아웃 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
    if (error.response?.status === 500) {
      console.error("서버 오류 : ", error.response.data?.message);
    }
    if (!error.response) {
      console.error("네트워크 오류 : 서버에 연결할 수 없습니다.");
    }
    return Promise.reject(error);
  },
);

export default instance;
