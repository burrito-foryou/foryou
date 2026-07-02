import instance from "../../../shared/api/instance";

// 북마크 추가
export const addBookmark = (questionId) =>
  instance.post(`/bookmarks/${questionId}`).then((res) => res.data);

// 북마크 취소
export const removeBookmark = (questionId) =>
  instance.delete(`/bookmarks/${questionId}`).then((res) => res.data);

// 북마크 여부 확인
export const getBookmarkStatus = (questionId) =>
  instance.get(`/bookmarks/${questionId}/status`).then((res) => res.data.data);
