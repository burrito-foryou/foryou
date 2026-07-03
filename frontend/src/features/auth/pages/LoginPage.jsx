import { Link, Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { ROUTES } from "../../../shared/constants/routes";
import useLoginForm from "../hooks/useLoginForm";
import { getOAuthUrl } from "../utils/oauthUrl";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const token = useAuthStore((s) => s.token);
  const { form, errors, handleChange, handleSubmit } = useLoginForm();

  // 이미 로그인된 경우 홈으로 redirect
  if (token) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-surface">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-10">
        <div className="mb-8 text-center">
          <p className="text-lg font-bold text-text">로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-text-muted">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              className={`w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-primary ${
                errors.email ? "border-red-400" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-muted">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className={`w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-primary ${
                errors.password ? "border-red-400" : "border-border"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.server && (
            <p className="text-center text-sm text-red-500">{errors.server}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            로그인
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-text-muted">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => (window.location.href = getOAuthUrl("google"))}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-sm hover:bg-surface"
          >
            <FcGoogle size={20} />
            구글로 로그인
          </button>
          <button
            onClick={() => (window.location.href = getOAuthUrl("kakao"))}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] py-2 text-sm font-bold text-[#3C1E1E] hover:brightness-95"
          >
            <RiKakaoTalkFill size={20} />
            카카오로 로그인
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          아직 계정이 없으신가요?{" "}
          <Link to={ROUTES.SIGNUP} className="text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
