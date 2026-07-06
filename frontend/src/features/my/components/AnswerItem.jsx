import { FiHeart } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import timeAgo from "../../../shared/utils/timeAgo";
import ItemCard from "./ItemCard";

const AnswerItem = ({ item }) => (
  <ItemCard to={toQuestionDetail(item.questionId)}>
    <p className="mb-1.5 text-xs text-text-muted line-clamp-1">Q. {item.questionTitle}</p>
    {(item.giftName || item.priceRange) && (
      <div className="mb-1.5 flex items-center gap-2">
        {item.giftName && <span className="text-xs font-medium text-text">{item.giftName}</span>}
        {item.priceRange && <span className="text-xs text-text-muted">{item.priceRange}</span>}
      </div>
    )}
    <p className="mb-2 text-sm text-text line-clamp-2">{item.content}</p>
    <div className="flex items-center justify-between text-xs text-text-muted">
      <span>{timeAgo(item.createdAt)}</span>
      {item.accepted && (
        <span className="flex items-center gap-1 text-primary font-semibold">
          <FiHeart size={12} /> 채택됨
        </span>
      )}
    </div>
  </ItemCard>
);

export default AnswerItem;
