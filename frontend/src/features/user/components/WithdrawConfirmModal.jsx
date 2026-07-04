const WithdrawConfirmModal = ({ loading, onConfirm, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mb-4 text-base font-bold text-text">회원 탈퇴</h2>
      <p className="text-sm text-text-muted">
        탈퇴하면 작성한 질문, 답변, 댓글 등 모든 활동 내역이 삭제되며, 내
        질문에 달린 다른 사용자의 답변·댓글도 함께 삭제됩니다. 이 작업은
        복구할 수 없습니다. 정말 탈퇴하시겠습니까?
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          탈퇴
        </button>
      </div>
    </div>
  </div>
);

export default WithdrawConfirmModal;
