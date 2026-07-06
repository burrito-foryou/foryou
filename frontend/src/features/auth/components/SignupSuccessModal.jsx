import { createPortal } from "react-dom";
import { FiCheckCircle } from "react-icons/fi";

const SignupSuccessModal = ({ onGoHome, onGoLogin }) =>
  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-sm p-7 shadow-soft">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <FiCheckCircle size={22} />
        </span>

        <h2 className="mb-1.5 text-lg font-black text-text">
          가입이 완료됐어요!
        </h2>
        <p className="text-sm leading-relaxed text-text-muted">
          당신의 고민에 딱 맞는 선물을 함께 찾아볼까요?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onGoHome}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            홈으로
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default SignupSuccessModal;
