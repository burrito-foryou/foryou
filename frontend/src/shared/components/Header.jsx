import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FiSearch } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import HeaderUserMenu from "./HeaderUserMenu";
import NotificationBell from "../../features/notification/components/NotificationBell";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* 로고 */}
        <Link to={ROUTES.HOME}>
          <span className="text-2xl font-bold text-primary">ForU</span>
        </Link>

        {/* 검색창 */}
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
          <NotificationBell />
          <HeaderUserMenu />
          <button>
            <RxHamburgerMenu size={22} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
