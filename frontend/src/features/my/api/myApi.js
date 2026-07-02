import instance from "../../../shared/api/instance";

export const getMyInfo = () =>
  instance.get("/members/me").then((res) => res.data.data);

export const getMyQuestions = (page = 0, size = 20) =>
  instance
    .get("/my/questions", { params: { page, size } })
    .then((res) => res.data.data.content);
