import { create } from "zustand";
import { isTokenExpired } from "../utils/tokenExpiry";

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

const getExpiresAt = (token) => {
  const exp = decodeJwt(token)?.exp;
  return exp ? exp * 1000 : null;
};

const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");
const storedExpiresAt = storedToken ? getExpiresAt(storedToken) : null;
const isStoredTokenValid =
  Boolean(storedToken) && !isTokenExpired(storedExpiresAt);

if (storedToken && !isStoredTokenValid) {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

const useAuthStore = create((set) => ({
  token: isStoredTokenValid ? storedToken : null,
  refreshToken: isStoredTokenValid ? storedRefreshToken : null,
  nickname: isStoredTokenValid
    ? (decodeJwt(storedToken)?.nickname ?? null)
    : null,
  profileImageUrl: null,
  expiresAt: isStoredTokenValid ? storedExpiresAt : null,

  setAuth: (token, refreshToken) => {
    const nickname = decodeJwt(token)?.nickname ?? null;
    const expiresAt = getExpiresAt(token);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    set({ token, refreshToken, nickname, profileImageUrl: null, expiresAt });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({
      token: null,
      refreshToken: null,
      nickname: null,
      profileImageUrl: null,
      expiresAt: null,
    });
  },

  setNickname: (nickname) => set({ nickname }),
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
  setMemberInfo: (member) =>
    set({
      nickname: member.nickname ?? null,
      profileImageUrl: member.profileImageUrl ?? null,
    }),
}));

export default useAuthStore;
