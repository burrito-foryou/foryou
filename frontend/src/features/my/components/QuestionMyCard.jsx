import { Link } from "react-router-dom";
import { FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";

const QuestionMyCard = ({ item }) => (
  // `/questions/${item.id}` => toQuestionDetail(item.id)
  <Link
    to={toQuestionDetail(item.id)}
    className="card block p-5 transition-colors hover:border-primary"
  >
    <div className="mb-3 flex items-center justify-between gap-2">
      {item.acceptedAnswerId ? (
        <span className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-black text-text-primary">
          <FiCheckCircle size={12} />
          채택완료
        </span>
      ) : (
        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-muted">
          채택 대기
        </span>
      )}
      <span className="text-xs font-semibold text-text-muted/70">
        {timeAgo(item.createdAt)}
      </span>
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

export default QuestionMyCard;
