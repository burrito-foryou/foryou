import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import useAuthStore from "../../auth/store/authStore";
import useLike from "../hooks/useLike";
import { ROUTES } from "../../../shared/constants/routes";

const LikeButton = ({ targetType, targetId, initialLikeCount }) => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const { liked, likeCount, toggleLike } = useLike(targetType, targetId, initialLikeCount);

  const handleClick = () => {
    if (!token) {
      navigate(ROUTES.LOGIN);
      return;
    }
    toggleLike();
  };

  return (
    <button onClick={handleClick} className="flex items-center gap-1 text-xs">
      <FiHeart
        size={14}
        className={liked ? "fill-pink-500 text-pink-500" : "text-gray-400"}
      />
      {likeCount}
    </button>
  );
};

export default LikeButton;