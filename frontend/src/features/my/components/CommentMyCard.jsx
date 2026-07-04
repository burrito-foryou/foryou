import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import QuestionRefHeader from "./QuestionRefHeader";

const CommentMyCard = ({ item }) => (
  <Link
    to={toQuestionDetail(item.questionId)}
    className="card block p-5 transition-colors hover:border-primary"
  >
    <QuestionRefHeader
      questionId={item.questionId}
      questionTitle={item.questionTitle}
    />
    <p className="mb-3 rounded-2xl bg-surface-muted px-4 py-3 text-sm text-text">
      {item.content}
    </p>
    <div className="flex items-center justify-between text-xs font-semibold text-text-muted/70">
      <span>{timeAgo(item.createdAt)}</span>
      <span className="flex items-center gap-1">
        <FiHeart size={12} className="font-bold" />
        {item.likeCount}
      </span>
    </div>
  </Link>
);

export default CommentMyCard;
