import instance from "../../../shared/api/instance";

export const getMyInfo = () =>
  instance.get("/members/me").then((res) => res.data.data);
