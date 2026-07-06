import { FiLogIn } from "react-icons/fi";

const LikeLoginModal = ({ onGoLogin, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-7 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <FiLogIn size={22} />
        </span>

        <h2 className="mb-6 text-lg font-black text-text">
          로그인이 필요한 기능이에요
        </h2>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            계속 구경하기
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            로그인 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeLoginModal;
