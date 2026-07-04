import { createPortal } from "react-dom";
import { FiLogOut } from "react-icons/fi";

const LogoutConfirmModal = ({ onConfirm, onClose }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-7 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <FiLogOut size={22} />
        </span>

        <h2 className="mb-1.5 text-lg font-black text-text">
          로그아웃 할까요?
        </h2>
        <p className="text-sm leading-relaxed text-text-muted">
          다시 로그인하면 언제든 이어서 고민할 수 있어요.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default LogoutConfirmModal;
