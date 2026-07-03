const LogoutConfirmModal = ({ onConfirm, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mb-4 text-base font-bold text-text">로그아웃</h2>
      <p className="text-sm text-text-muted">로그아웃 하시겠습니까?</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  </div>
);

export default LogoutConfirmModal;
