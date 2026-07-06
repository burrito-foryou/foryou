import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import useCommentForm from "../hooks/useCommentForm";
import useAuthStore from "../../auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import { ROUTES } from "../../../shared/constants/routes";

const CommentForm = ({ answerId, onSuccess }) => {
  const { content, error, loading, handleChange, handleSubmit } =
    useCommentForm(answerId, onSuccess);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleFormSubmit = (e) => {
    if (!token) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    handleSubmit(e);
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="mt-2 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={content}
            onChange={handleChange}
            placeholder="댓글을 입력하세요"
            maxLength={50}
            className="h-10 w-full rounded-full border border-border bg-white px-4 pr-14 text-sm outline-none transition-colors focus:border-primary"
          />
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs ${
              content.length >= 50 ? "text-red-500" : "text-text-muted"
            }`}
          >
            {content.length}/50
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          <FiArrowUp size={18} />
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {showLoginModal && (
        <LikeLoginModal
          onClose={() => setShowLoginModal(false)}
          onGoLogin={() => navigate(ROUTES.LOGIN)}
        />
      )}
    </>
  );
};

export default CommentForm;
