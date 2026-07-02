import instance from "../../../shared/api/instance";

export const getComments = (answerId) =>
  instance.get(`/answers/${answerId}/comments`);

export const createComment = (answerId, memberId, data) =>
  instance.post(`/answers/${answerId}/comments?memberId=${memberId}`, data);
