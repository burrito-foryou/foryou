export const FILTER_OPTIONS = {
  target: ["여자친구", "남자친구", "부모님", "친구", "직장동료", "선생님"],
  gender: ["여성", "남성"],
  ageGroup: ["10대", "20대", "30대", "40대", "50대 이상"],
  budget: ["1만원대", "3만원대", "5만원대", "10만원대", "10만원 이상"],
  situation: ["생일", "기념일", "크리스마스", "어버이날", "졸업", "입학", "취업"],
  giftType: ["패션/뷰티", "테크/가전", "식품", "건강", "취미", "인테리어"],
};

export const FILTER_LABELS = {
  target: "대상",
  gender: "성별",
  ageGroup: "나이대",
  budget: "예산",
  situation: "상황",
  giftType: "카테고리",
};

export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "likes", label: "좋아요순" },
  { value: "answers", label: "답변많은순" },
];
