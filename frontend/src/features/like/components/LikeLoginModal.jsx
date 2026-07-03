const LikeLoginModal = ({ onGoLogin, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 text-center shadow-lg">
        <p className="mb-6 text-sm text-text">로그인이 필요한 기능입니다</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border py-2 text-sm text-text hover:bg-surface"
          >
            계속 구경하기
          </button>
          <button
            onClick={onGoLogin}
            className="flex-1 rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            로그인 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeLoginModal;