const NicknameEditModal = ({
  value,
  loading,
  error,
  onChange,
  onSave,
  onClose,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mb-4 text-base font-bold text-text">닉네임 수정</h2>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onClose();
        }}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text focus:outline-none ${
          error
            ? "border-error focus:border-error"
            : "border-gray-200 focus:border-primary"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  </div>
);

export default NicknameEditModal;
