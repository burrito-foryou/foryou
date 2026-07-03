import instance from "../../../shared/api/instance";

export const getAnswers = (questionId) =>
  instance.get(`/questions/${questionId}/answers`);

export const createAnswer = (questionId, data) =>
  instance.post(`/questions/${questionId}/answers`, data);

export const updateAnswer = (answerId, data) =>
  instance.put(`/answers/${answerId}`, data);

export const deleteAnswer = (answerId) =>
  instance.delete(`/answers/${answerId}`);

export const acceptAnswer = (answerId) =>
  instance.patch(`/answers/${answerId}/accept`);
