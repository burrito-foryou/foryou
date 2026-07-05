import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import useAuthStore from "../../auth/store/authStore";
import useLike from "../hooks/useLike";
import { ROUTES } from "../../../shared/constants/routes";
import LikeLoginModal from "./LikeLoginModal";

const LikeButton = ({ targetType, targetId, initialLikeCount, label }) => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const { liked, likeCount, toggleLike } = useLike(
    targetType,
    targetId,
    initialLikeCount,
  );
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    toggleLike();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 text-xs font-bold text-text-muted"
      >
        <FiHeart
          size={14}
          className={liked ? "fill-primary text-primary" : "text-text-muted"}
        />
        {label && <span>{label}</span>}
        {likeCount}
      </button>

      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
};

export default LikeButton;
