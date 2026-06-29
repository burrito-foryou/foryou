import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const SignupPage = () => {
  // useState로 폼 상태 관리 (로그인이랑 동일)
  // passwordConfirm은 백엔드로 보내는 값이 아니고 프론트에서 쓰는 검증용
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // 공통 핸들러 (로그인이랑 동일)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // API 연동 시 여기서 해야 할 것들
  // password !== passwordConfirm 검증
  // authApi.signUp({nickname, email, password}) 호출
  const handleSubmit = (e) => {
    e.preventDefault();
    // API 연동 시 여기에 작성
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-10">
        {/* 로고 & 타이틀 */}
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <p className="text-2xl font-bold text-primary">ForU</p>
          </Link>
          <p className="mt-1 text-lg font-bold text-text">회원가입</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-text-muted">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              className="w-full rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-muted">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              className="w-full rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            />
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
              className="w-full rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-muted">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            회원가입
          </button>
        </form>

        {/* 로그인 링크 */}
        <p className="mt-6 text-center text-sm text-text-muted">
          이미 계정이 있으신가요?{" "}
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
