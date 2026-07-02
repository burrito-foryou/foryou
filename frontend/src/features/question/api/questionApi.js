import instance from "../../../shared/api/instance";

// ErrorCode.java의 코드값을 상수로 관리
const ERROR_CODES = {
  QUESTION_NOT_FOUND: "QUESTION_001",
  QUESTION_FORBIDDEN: "QUESTION_002",
};

// 질문 목록을 가져옴
// params에 sort/page/size/필터 값들이 담겨서 쿼리스트링으로 변환됨
export const getQuestions = (params) =>
  instance
    .get("/questions", { params })
    .then((res) => res.data.data)
    .catch((err) => {
      if (err.response?.data?.code === ERROR_CODES.QUESTION_NOT_FOUND) {
        return [];
      }
      throw err;
    });

// 질문 단건 조회
export const getQuestionDetail = (questionId) =>
  instance
    .get(`/questions/${questionId}`)
    .then((res) => res.data.data)
    .catch((err) => {
      if (err.response?.data?.code === ERROR_CODES.QUESTION_NOT_FOUND) {
        throw new Error("질문을 찾을 수 없습니다.");
      }
      throw err;
    });

// 질문 작성
export const createQuestion = (memberId, data) =>
    instance
        .post("/questions", data, { params: { memberId } })
        .then((res) => res.data.data);

// 질문 수정
export const updateQuestion = (questionId, memberId, data) =>
    instance
        .patch(`/questions/${questionId}`, data, { params: { memberId } })
        .then((res) => res.data.data);
// 질문 삭제
export const deleteQuestion = (questionId, memberId) =>
    instance
        .delete(`/questions/${questionId}`, { params: { memberId } })
        .then((res) => res.data);
// 질문에 첨부된 이미지 목록 조회
export const getQuestionImages = (questionId) =>
    instance.get(`/images/QUESTION/${questionId}`).then((res) => res.data.data);