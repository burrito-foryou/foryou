import { create } from "zustand";

const decodeJwt = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");

const useAuthStore = create((set) => ({
  token: storedToken ?? null,
  refreshToken: storedRefreshToken ?? null,
  nickname: storedToken ? (decodeJwt(storedToken)?.nickname ?? null) : null,

  setAuth: (token, refreshToken) => {
    const nickname = decodeJwt(token)?.nickname ?? null;
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    set({ token, refreshToken, nickname });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ token: null, refreshToken: null, nickname: null });
  },

  setNickname: (nickname) => set({ nickname }),
}));

export default useAuthStore;
