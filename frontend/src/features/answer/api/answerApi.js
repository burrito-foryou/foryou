import instance from "../../../shared/api/instance";

export const getAnswers = (questionId) =>
  instance.get(`/questions/${questionId}/answers`);

export const createAnswer = (questionId, memberId, data) =>
  instance.post(`/questions/${questionId}/answers?memberId=${memberId}`, data);
