import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useSignupForm from "../hooks/useSignupForm";
import SignupSuccessModal from "../components/SignupSuccessModal";
import useAuthStore from "../store/authStore";

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+=\-{}[\]:;"'<>,.?/]/.test(password)) score += 1;

  if (score <= 1) return { level: 1, label: "약함" };
  if (score === 2) return { level: 2, label: "보통" };
  return { level: 3, label: "강함" };
};

const SignupPage = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const { form, errors, handleChange, handleSubmit, showModal } =
    useSignupForm();
  const [showPassword, setShowPassword] = useState(false);

  if (token) return <Navigate to={ROUTES.HOME} replace />;

  const strength = getPasswordStrength(form.password);
  const isPasswordMatched =
    form.passwordConfirm.length > 0 &&
    form.passwordConfirm === form.password &&
    !errors.passwordConfirm;

  return (
    <>
      {showModal && (
        <SignupSuccessModal
          onGoHome={() => navigate(ROUTES.HOME)}
          onGoLogin={() => navigate(ROUTES.LOGIN)}
        />
      )}

      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-black text-text [-webkit-text-stroke:0.5px_currentColor] sm:text-3xl">
              ForU 시작하기
            </h1>
            <p className="text-m text-text-muted">
              가입하면 바로 선물 고민을 올릴 수 있어요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="foryou에서 사용할 이름이에요"
                className={`h-12 w-full rounded-2xl border bg-background px-5 text-sm outline-none transition-colors focus:border-primary ${
                  errors.nickname ? "border-red-400" : "border-border"
                }`}
              />
              {errors.nickname && (
                <p className="mt-1 text-xs text-red-500">{errors.nickname}</p>
              )}
            </div>

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
              <label className="mb-1.5 block text-sm font-bold text-text">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="영문, 숫자, 특수문자를 섞어 8자 이상으로"
                  className={`h-12 w-full rounded-2xl border bg-background px-5 pr-11 text-sm outline-none transition-colors focus:border-primary ${
                    errors.password ? "border-red-400" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                  }
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((segment) => (
                      <div
                        key={segment}
                        className={`h-1 flex-1 rounded-full ${
                          segment <= strength.level ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {strength.label}
                  </span>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  placeholder="한 번 더 확인할게요"
                  className={`h-12 w-full rounded-2xl border bg-background px-5 pr-11 text-sm outline-none transition-colors focus:border-primary ${
                    errors.passwordConfirm ? "border-red-400" : "border-border"
                  }`}
                />
                {isPasswordMatched && (
                  <FiCheckCircle
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
              {errors.passwordConfirm && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {errors.server && (
              <p className="text-center text-sm text-red-500">
                {errors.server}
              </p>
            )}

            <button type="submit" className="btn btn-primary mt-2 w-full">
              가입하기
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            이미 계정이 있으신가요?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
