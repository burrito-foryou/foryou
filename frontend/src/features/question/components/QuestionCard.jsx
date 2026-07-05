import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiCheckCircle,
  FiEye,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";
import timeAgo from "../../../shared/utils/timeAgo";
import { toQuestionDetail, ROUTES } from "../../../shared/constants/routes";
import useBookmark from "../hooks/useBookmark";
import useAuthStore from "../../auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import useMemberId from "../hooks/useMemberId";
import Avatar from "../../../shared/components/Avatar";

const QuestionCard = ({ question: q }) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 백엔드 Java boolean 필드 isBookmarked → Jackson이 "bookmarked"로 직렬화
  const { isBookmarked, toggle, loading } = useBookmark(q.bookmarked ?? false);

  const handleBookmark = (e) => {
    e.preventDefault();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    toggle(q.id);
  };

  const memberId = useMemberId();

  return (
    <>
      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {/* `/questions/${q.id}` => toQuestionDetail(q.id) */}
      <Link to={toQuestionDetail(q.id)}>
        <div className="card p-6 transition-colors hover:border-primary">
          <div className="mb-4 flex items-center justify-between gap-2">
            {q.acceptedAnswerId ? (
              <span className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-black text-text-primary">
                <FiCheckCircle size={12} />
                채택완료
              </span>
            ) : (
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-muted">
                채택 대기
              </span>
            )}
            {q.memberId !== memberId && (
              <button
                onClick={handleBookmark}
                disabled={loading}
                className="shrink-0 text-text-muted transition-colors hover:text-primary disabled:opacity-50"
              >
                <FiBookmark
                  size={18}
                  className={isBookmarked ? "fill-primary text-primary" : ""}
                />
              </button>
            )}
          </div>

          <p className="mb-2 text-base font-bold leading-snug text-text">
            {q.title}
          </p>

          <p className="mb-4 line-clamp-1 text-sm text-text-muted">
            {q.content}
          </p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {q.tagNames.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="flex items-center gap-2 text-xs text-text-muted">
              <Avatar
                src={q.memberProfileImageUrl}
                name={q.memberNickname}
                size={20}
                textSize="text-[10px]"
              />
              {q.memberNickname} · {timeAgo(q.createdAt)}
            </span>
            <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
              <span className="flex items-center gap-1">
                <FiEye size={14} /> {q.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <FiHeart size={14} /> {q.likeCount}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  q.answerCount > 0 ? "text-primary" : "text-text-muted"
                }`}
              >
                <FiMessageSquare size={14} /> 답변 {q.answerCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default QuestionCard;
