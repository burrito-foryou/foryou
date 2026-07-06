import { Link } from "react-router-dom";
import { FiCheckCircle, FiGift, FiHeart } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import QuestionRefHeader from "./QuestionRefHeader";

const AnswerMyCard = ({ item }) => (
  <Link
    to={toQuestionDetail(item.questionId)}
    className="card block p-5 transition-colors hover:border-primary"
  >
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <QuestionRefHeader
          questionId={item.questionId}
          questionTitle={item.questionTitle}
        />
      </div>
      {item.accepted && (
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-black text-primary">
          <FiCheckCircle size={12} />
          채택됨
        </span>
      )}
    </div>

    {(item.giftName || item.priceRange) && (
      <div className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-surface-muted px-4 py-2.5 text-sm leading-none">
        <FiGift size={16} className="shrink-0 text-primary" />
        {item.giftName && (
          <span className="font-bold text-text">{item.giftName}</span>
        )}
        {item.giftName && item.priceRange && (
          <span className="h-3.5 w-px shrink-0 bg-border" />
        )}
        {item.priceRange && (
          <span className="text-text-muted">{item.priceRange}</span>
        )}
      </div>
    )}

    <p className="mb-3 text-sm leading-relaxed text-text">{item.content}</p>

    <div className="flex items-center justify-between text-xs text-text-muted">
      <span className="font-semibold text-text-muted/70">
        {timeAgo(item.createdAt)}
      </span>
      <span className="flex items-center gap-1 font-bold">
        <FiHeart size={12} />
        {item.likeCount}
      </span>
    </div>
  </Link>
);

export default AnswerMyCard;
