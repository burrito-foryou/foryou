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

const useAuthStore = create((set) => ({
  token: storedToken ?? null,
  nickname: storedToken ? (decodeJwt(storedToken)?.nickname ?? null) : null,

  setAuth: (token) => {
    const nickname = decodeJwt(token)?.nickname ?? null;
    localStorage.setItem("token", token);
    set({ token, nickname });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    set({ token: null, nickname: null });
  },
}));

export default useAuthStore;
