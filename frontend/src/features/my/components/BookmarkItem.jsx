import { FiBookmark, FiMessageSquare } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import ItemCard from "./ItemCard";
import TagList from "./TagList";

const BookmarkItem = ({ item }) => (
  <ItemCard to={toQuestionDetail(item.questionId)}>
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="text-sm font-semibold text-text leading-snug">{item.title}</p>
      <FiBookmark size={14} className="shrink-0 text-primary fill-primary mt-0.5" />
    </div>
    <TagList tagNames={item.tagNames} />
    <div className="flex items-center justify-between text-xs text-text-muted">
      <span>{timeAgo(item.createdAt)}</span>
      <span className="flex items-center gap-1">
        <FiMessageSquare size={12} /> {item.answerCount}
      </span>
    </div>
  </ItemCard>
);

export default BookmarkItem;
