import { useState } from "react";
import { addBookmark, removeBookmark } from "../api/bookmarkApi";

// QuestionCard, QuestionDetailPage에서 공통으로 쓰는 북마크 토글 훅
const useBookmark = (initialValue, showToast) => {
  const [isBookmarked, setIsBookmarked] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const toggle = async (questionId) => {
    if (loading) return; // 중복 클릭 방지
    setLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(questionId);
        showToast?.("북마크가 해제되었습니다.");
      } else {
        await addBookmark(questionId);
        showToast?.("북마크에 추가되었습니다.");
      }
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error("북마크 오류:", err?.response?.status, err?.response?.data ?? err);
      showToast?.("북마크 처리에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { isBookmarked, setIsBookmarked, toggle, loading };
};

export default useBookmark;
