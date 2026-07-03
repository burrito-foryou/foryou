import instance from "../../../shared/api/instance";

export const getAnswers = (questionId) =>
  instance.get(`/questions/${questionId}/answers`);

export const createAnswer = (questionId, memberId, data) =>
  instance.post(`/questions/${questionId}/answers?memberId=${memberId}`, data);

export const updateAnswer = (answerId, memberId, data) =>
  instance.put(`/answers/${answerId}?memberId=${memberId}`, data);

export const deleteAnswer = (answerId, memberId) =>
  instance.delete(`/answers/${answerId}?memberId=${memberId}`);

export const acceptAnswer = (answerId, memberId) =>
  instance.patch(`/answers/${answerId}/accept?memberId=${memberId}`);
