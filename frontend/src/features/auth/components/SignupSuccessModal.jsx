const SignupSuccessModal = ({ onGoHome, onGoLogin }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 text-center shadow-lg">
        <p className="mb-2 text-3xl">✓</p>
        <p className="mb-1 text-lg font-bold text-text">회원가입 완료!</p>
        <p className="mb-6 text-sm text-text-muted">ForU의 회원이 되었어요.</p>

        <div className="flex gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 rounded-md border border-border py-2 text-sm text-text hover:bg-surface"
          >
            홈으로
          </button>
          <button
            onClick={onGoLogin}
            className="flex-1 rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessModal;
