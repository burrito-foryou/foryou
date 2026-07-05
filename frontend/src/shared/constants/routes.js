export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  SIGNUP: "/signup",
  OAUTH_CALLBACK: "/auth/callback/:provider",

  MY_PAGE: "/my",
  MY_ACCOUNT: "/my/account",

  QUESTIONS: "/questions",
  QUESTION_DETAIL: "/questions/:id",
  QUESTION_WRITE: "/questions/write",
  QUESTION_EDIT: "/questions/:id/edit",

  GUIDE: "/guide",

  NOTIFICATIONS: "/notifications",
};

// 동적 경로 헬퍼 — id를 받아서 실제 URL 문자열로 변환
export const toQuestionDetail = (id) => `/questions/${id}`;
export const toQuestionEdit = (id) => `/questions/${id}/edit`;
