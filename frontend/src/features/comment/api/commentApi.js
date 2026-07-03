import instance from "../../../shared/api/instance";

export const getComments = (answerId) =>
  instance.get(`/answers/${answerId}/comments`);

export const createComment = (answerId, memberId, data) =>
  instance.post(`/answers/${answerId}/comments?memberId=${memberId}`, data);

export const updateComment = (commentId, memberId, data) =>
  instance.put(`/comments/${commentId}?memberId=${memberId}`, data);

export const deleteComment = (commentId, memberId) =>
  instance.delete(`/comments/${commentId}?memberId=${memberId}`);
