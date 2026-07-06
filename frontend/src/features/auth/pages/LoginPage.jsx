import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useLoginForm from "../hooks/useLoginForm";
import { getOAuthUrl } from "../utils/oauthUrl";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  const { form, errors, handleChange, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const oauthError = location.state?.oauthError;

  // 이미 로그인된 경우 홈으로 redirect
  if (token) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-black text-text [-webkit-text-stroke:0.5px_currentColor] sm:text-3xl">
            다시 만나서 반가워요
          </h1>
          <p className="text-m text-text-muted">
            선물 고민, 이어서 해결해 볼까요?
          </p>
        </div>

        {oauthError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-500">
            {oauthError}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = getOAuthUrl("kakao"))}
            className="btn w-full bg-[#FEE500] text-[#3C1E1E] hover:brightness-95"
          >
            <RiKakaoTalkFill size={20} />
            카카오 계정으로 시작하기
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = getOAuthUrl("google"))}
            className="btn btn-secondary w-full"
          >
            <FcGoogle size={20} />
            Google 계정으로 시작하기
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold text-text-muted">
            또는 이메일로
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-text">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="foryou@burrito.com"
              className={`h-12 w-full rounded-2xl border bg-background px-5 text-sm outline-none transition-colors focus:border-primary ${
                errors.email ? "border-red-400" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-bold text-text">비밀번호</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className={`h-12 w-full rounded-2xl border bg-background px-5 pr-11 text-sm outline-none transition-colors focus:border-primary ${
                  errors.password ? "border-red-400" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.server && (
            <p className="text-center text-sm text-red-500">{errors.server}</p>
          )}

          <button type="submit" className="btn btn-primary mt-2 w-full">
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          아직 계정이 없으신가요?{" "}
          <Link
            to={ROUTES.SIGNUP}
            className="font-bold text-primary hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
