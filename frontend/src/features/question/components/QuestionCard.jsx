import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiEye, FiHeart, FiMessageSquare } from "react-icons/fi";
import timeAgo from "../../../shared/utils/timeAgo";

const QuestionCard = ({ question: q }) => {
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 추가

  // 북마크 토글 (카드 클릭 이벤트 전파 방지)
  const handleBookmark = (e) => {
    e.preventDefault();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <Link to={`/questions/${q.id}`}>
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
                size={16}
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
