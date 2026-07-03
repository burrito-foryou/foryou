import instance from "../../../shared/api/instance";

export const signup = ({ email, password, nickname }) =>
  instance.post("/auth/signup", { email, password, nickname });

export const login = ({ email, password }) =>
  instance.post("/auth/login", { email, password });

export const socialLogin = ({ provider, code }) =>
  instance.get(`/auth/login/${provider}`, { params: { code } });

export const logout = () => instance.post("/auth/logout");
