import { FiHeart } from "react-icons/fi";
import useLike from "../hooks/useLike";

const LikeButton = ({ targetType, targetId, initialLikeCount }) => {
  const { liked, likeCount, toggleLike } = useLike(targetType, targetId, initialLikeCount);

  return (
    <button onClick={toggleLike} className="flex items-center gap-1 text-xs">
      <FiHeart
        size={14}
        className={liked ? "fill-pink-500 text-pink-500" : "text-gray-400"}
      />
      {likeCount}
    </button>
  );
};

export default LikeButton;