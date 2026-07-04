import instance from "../../../shared/api/instance";

export const getMyInfo = () =>
  instance.get("/members/me").then((res) => res.data.data);

export const getMyQuestions = (page = 0, size = 20) =>
  instance
    .get("/my/questions", { params: { page, size } })
    .then((res) => res.data.data);

export const getMyAnswers = (page = 0, size = 20) =>
  instance
    .get("/my/answers", { params: { page, size } })
    .then((res) => res.data.data);

export const getMyComments = (page = 0, size = 20) =>
  instance
    .get("/my/comments", { params: { page, size } })
    .then((res) => res.data.data);

export const getMyBookmarks = (page = 0, size = 20) =>
  instance
    .get("/my/bookmarks", { params: { page, size } })
    .then((res) => res.data.data);
