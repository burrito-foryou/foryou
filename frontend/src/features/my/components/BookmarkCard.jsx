import { Link } from "react-router-dom";
import { FiBookmark, FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import useBookmark from "../../question/hooks/useBookmark";

// 마이페이지 "북마크한 질문" 탭 전용 카드 — 이미 북마크된 항목만 다루므로
// QuestionCard와 달리 로그인 체크/작성자 판별 없이 바로 해제 토글만 제공한다.
const BookmarkCard = ({ item }) => {
  const { isBookmarked, toggle, loading } = useBookmark(true);

  const handleToggle = (e) => {
    e.preventDefault();
    toggle(item.questionId);
  };

  if (!isBookmarked) return null;

  return (
    <Link
      to={toQuestionDetail(item.questionId)}
      className="card block p-5 transition-colors hover:border-primary"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        {item.acceptedAnswerId ? (
          <span className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
            <FiCheckCircle size={12} />
            채택완료
          </span>
        ) : (
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-muted">
            채택 대기
          </span>
        )}
        <button
          onClick={handleToggle}
          disabled={loading}
          className="shrink-0 text-primary transition-colors disabled:opacity-50"
        >
          <FiBookmark size={18} className="fill-primary" />
        </button>
      </div>
      <p className="mb-3 text-base font-bold leading-snug text-text">
        {item.title}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tagNames.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
          <FiMessageSquare size={14} /> 답변 {item.answerCount}
        </span>
      </div>
    </Link>
  );
};

export default BookmarkCard;
