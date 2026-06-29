import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";

const LoginPage = () => {
  // useState로 폼 상태 관리
  // 입력값들을 객체 하나로 묶어서 관리
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // handleChange 공통 입력 핸들러
  // name 속성으로 어떤 필드인지 구분
  // onChange={handleChange} 하나로 전부 처리 => 필드마다 핸들러 따로 X
  // [name]: value => 동적키 (해당 필드만 업데이트)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 막음
    // BE API 연동 시 여기에 작성
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-10">
        {/* 로고 & 타이틀 */}
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <p className="text-2xl font-bold text-primary">ForU</p>
          </Link>
          <p className="mt-1 text-lg font-bold text-text">로그인</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-text-muted">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* 소셜 로그인 */}
        <div className="flex flex-col gap-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-sm hover:bg-surface">
            <FcGoogle size={20} />
            구글로 로그인
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] py-2 text-sm font-bold text-[#3C1E1E] hover:brightness-95">
            <RiKakaoTalkFill size={20} />
            카카오로 로그인
          </button>
        </div>

        {/* 회원가입 링크 */}
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
