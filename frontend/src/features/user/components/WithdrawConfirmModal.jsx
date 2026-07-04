import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";

const WithdrawConfirmModal = ({ loading, onConfirm, onClose }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-7 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
          <FiAlertTriangle size={22} />
        </span>

        <h2 className="mb-1.5 text-lg font-black text-text">회원 탈퇴</h2>
        <p className="text-sm leading-relaxed text-text-muted">
          탈퇴하면 작성한 질문, 답변, 댓글 등 모든 활동 내역이 삭제되며, 내
          질문에 달린 다른 사용자의 답변·댓글도 함께 삭제됩니다. 이 작업은
          복구할 수 없습니다. 정말 탈퇴하시겠습니까?
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
            disabled={loading}
            className="rounded-full bg-error px-6 py-2.5 text-sm font-bold text-white transition-colors hover:brightness-90 disabled:opacity-50"
          >
            {loading ? "탈퇴 중..." : "탈퇴"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default WithdrawConfirmModal;
