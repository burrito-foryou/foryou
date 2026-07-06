import { FiMessageSquare } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import ItemCard from "./ItemCard";
import TagList from "./TagList";

const QuestionItem = ({ item }) => (
  <ItemCard to={toQuestionDetail(item.id)}>
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="text-sm font-semibold text-text leading-snug">{item.title}</p>
      {item.acceptedAnswerId && (
        <span className="shrink-0 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
          채택완료
        </span>
      )}
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

export default QuestionItem;
