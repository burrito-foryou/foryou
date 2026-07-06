import instance from "../../../shared/api/instance";

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance.post("/images/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data.data);
};

export const uploadQuestionImage = (questionId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance.post(`/images/questions/${questionId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data.data);
};

export const uploadAnswerImage = (answerId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance.post(`/images/answers/${answerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data.data);
};

export const getAnswerImages = (answerId) =>
  instance.get(`/images/ANSWER/${answerId}`).then((res) => res.data.data);

export const deleteImage = (imageId) =>
  instance.delete(`/images/${imageId}`).then((res) => res.data);
