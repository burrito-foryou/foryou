import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FiSearch } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import useAuthStore from "../../features/auth/store/authStore";

const Header = () => {
  const token = useAuthStore((state) => state.token);
  const nickname = useAuthStore((state) => state.nickname);

  return (
    <header className="border-b border-border px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* 로고 */}
        <Link to={ROUTES.HOME}>
          <span className="text-2xl font-bold text-primary">ForU</span>
        </Link>

        {/* 검색창 - 모바일: 세 번째 줄 전체 너비 / md 이상: 가운데 */}
        <div className="relative order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:max-w-md sm:mx-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="선물 고민 검색..."
            className="w-full rounded-full bg-gray-100 px-4 py-2 pl-9 text-sm outline-none"
          />
        </div>

        {/* 우측 영역 */}
        <div className="order-2 flex items-center gap-4 sm:order-3">
          {token ? (
            <Link
              to={ROUTES.MY_PAGE}
              className="text-sm font-bold text-primary hover:underline"
            >
              {nickname ? `${nickname}님` : "마이페이지"}
            </Link>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary-hover"
            >
              로그인
            </Link>
          )}
          <button>
            <RxHamburgerMenu size={22} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
