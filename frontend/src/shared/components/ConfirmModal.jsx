import { createPortal } from "react-dom";

const VARIANT_STYLES = {
  primary: {
    badge: "bg-primary-light text-primary",
    confirmButton: "bg-primary hover:bg-primary-hover",
  },
  danger: {
    badge: "bg-error/10 text-error",
    confirmButton: "bg-error hover:brightness-90",
  },
};

const ConfirmModal = ({
  title,
  message,
  confirmText = "확인",
  icon: Icon,
  variant = "primary",
  onConfirm,
  onClose,
}) => {
  const { badge, confirmButton } = VARIANT_STYLES[variant];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-7 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {Icon && (
          <span
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${badge}`}
          >
            <Icon size={22} />
          </span>
        )}
        {title && (
          <h2 className="mb-1.5 text-lg font-black text-text">{title}</h2>
        )}
        <p className="text-sm leading-relaxed text-text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
