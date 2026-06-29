import instance from "../../../shared/api/instance";

export const signup = ({ email, password, nickname }) =>
  instance.post("/auth/signup", { email, password, nickname });
