import { createPortal } from "react-dom";
import { FiEdit2 } from "react-icons/fi";

const NicknameEditModal = ({
  value,
  loading,
  error,
  onChange,
  onSave,
  onClose,
}) =>
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
          <FiEdit2 size={20} />
        </span>

        <h2 className="mb-1.5 text-lg font-black text-text">닉네임 수정</h2>
        <p className="mb-4 text-sm text-text-muted">
          다른 사람에게 보여질 이름이에요
        </p>

        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onClose();
          }}
          className={`h-12 w-full rounded-2xl border bg-background px-5 text-sm text-text outline-none transition-colors ${
            error ? "border-error" : "border-border focus:border-primary"
          }`}
        />
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            취소
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default NicknameEditModal;
