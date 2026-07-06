import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import ItemCard from "./ItemCard";

const CommentItem = ({ item }) => (
  <ItemCard to={toQuestionDetail(item.questionId)}>
    <p className="mb-1.5 text-xs text-text-muted line-clamp-1">Q. {item.questionTitle}</p>
    <p className="mb-2 text-sm text-text line-clamp-2">{item.content}</p>
    <span className="text-xs text-text-muted">{timeAgo(item.createdAt)}</span>
  </ItemCard>
);

export default CommentItem;
