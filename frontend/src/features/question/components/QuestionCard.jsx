import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiEye, FiHeart, FiMessageSquare } from "react-icons/fi";
import timeAgo from "../../../shared/utils/timeAgo";
import { toQuestionDetail } from "../../../shared/constants/routes";
import { addBookmark, removeBookmark } from "../api/bookmarkApi";

const QuestionCard = ({ question: q }) => {
  // 백엔드 Java boolean 필드 isBookmarked → Jackson이 "bookmarked"로 직렬화
  const [isBookmarked, setIsBookmarked] = useState(q.bookmarked ?? false);

  // 북마크 토글 — 카드 클릭 이벤트 전파 방지 후 API 호출
  const handleBookmark = async (e) => {
    e.preventDefault();
    try {
      if (isBookmarked) {
        await removeBookmark(q.id);
      } else {
        await addBookmark(q.id);
      }
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error("북마크 오류:", err?.response?.status, err?.response?.data ?? err);
    }
  };

  return (
    // `/questions/${q.id}` => toQuestionDetail(q.id)
    <Link to={toQuestionDetail(q.id)}>
      <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary hover:shadow-sm">
        <div className="mb-2 flex items-start justify-between gap-3">
          <p className="font-bold text-text leading-snug">{q.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            {q.acceptedAnswerId && (
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                채택완료
              </span>
            )}
            <button
              onClick={handleBookmark}
              className="text-text-muted hover:text-primary transition-colors"
            >
              <FiBookmark
                size={20}
                className={isBookmarked ? "fill-primary text-primary" : ""}
              />
            </button>
          </div>
        </div>
        <p className="mb-3 line-clamp-1 text-sm text-text-muted">{q.content}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {q.tagNames.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2.5 py-1 text-xs text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-text-muted">
            {q.memberNickname} · {timeAgo(q.createdAt)}
          </span>
          <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
            <span className="flex items-center gap-1"><FiEye size={14} /> {q.viewCount}</span>
            <span className="flex items-center gap-1"><FiHeart size={14} /> {q.likeCount}</span>
            <span className="flex items-center gap-1"><FiMessageSquare size={14} /> {q.answerCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
