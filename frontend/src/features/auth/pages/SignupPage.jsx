import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import useSignupForm from "../hooks/useSignupForm";
import SignupSuccessModal from "../components/SignupSuccessModal";

const FIELDS = [
  {
    label: "닉네임",
    name: "nickname",
    type: "text",
    placeholder: "닉네임을 입력하세요",
  },
  {
    label: "이메일",
    name: "email",
    type: "email",
    placeholder: "이메일을 입력하세요",
  },
  {
    label: "비밀번호",
    name: "password",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
  {
    label: "비밀번호 확인",
    name: "passwordConfirm",
    type: "password",
    placeholder: "비밀번호를 다시 입력하세요",
  },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { form, errors, handleChange, handleSubmit, showModal } =
    useSignupForm();

  return (
    <>
      {showModal && (
        <SignupSuccessModal
          onGoHome={() => navigate(ROUTES.HOME)}
          onGoLogin={() => navigate(ROUTES.LOGIN)}
        />
      )}

      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-surface">
        <div className="w-full max-w-md rounded-lg border border-border bg-background p-10">
          <div className="mb-8 text-center">
            <p className="text-lg font-bold text-text">회원가입</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {FIELDS.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="mb-1 block text-sm text-text-muted">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-primary ${
                    errors[name] ? "border-red-400" : "border-border"
                  }`}
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            {errors.server && (
              <p className="text-center text-sm text-red-500">
                {errors.server}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              회원가입
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            이미 계정이 있으신가요?{" "}
            <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
