import instance from "../../../shared/api/instance";

export const getComments = (answerId) =>
  instance.get(`/answers/${answerId}/comments`);

export const createComment = (answerId, data) =>
  instance.post(`/answers/${answerId}/comments`, data);

export const updateComment = (commentId, data) =>
  instance.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  instance.delete(`/comments/${commentId}`);
