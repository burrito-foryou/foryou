import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FiSearch } from "react-icons/fi";
import HeaderUserMenu from "./HeaderUserMenu";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NotificationBell from "../../features/notification/components/NotificationBell";

const NAV_ITEMS = [
  { label: "질문 피드", to: ROUTES.QUESTIONS },
  { label: "가이드", to: ROUTES.QUESTIONS },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(searchParams.get("keyword") ?? "");
  }, [searchParams]);

  // 엔터 입력 시 질문 목록 페이지로 검색 이동
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(
        `${ROUTES.QUESTIONS}?keyword=${encodeURIComponent(searchValue.trim())}`,
      );
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="app-container flex min-h-[61px] flex-wrap items-center justify-between gap-x-4 gap-y-3 py-2.5">
        <div className="flex items-center gap-7">
          <Link
            to={ROUTES.HOME}
            className="shrink-0 text-2xl font-black tracking-tight text-text [-webkit-text-stroke:0.5px_currentColor]"
            aria-label="ForU 홈"
          >
            For<span className="text-primary">U</span>
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="주요 메뉴"
          >
            {NAV_ITEMS.map(({ label, to }) => {
              const isActive =
                label === "질문 피드" &&
                location.pathname.startsWith(ROUTES.QUESTIONS);

              return (
                <Link
                  key={label}
                  to={to}
                  className={`py-1 text-sm transition-colors ${
                    isActive
                      ? "font-extrabold text-text"
                      : "font-bold text-text-muted hover:text-text"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="order-3 w-full md:order-none md:ml-64 md:max-w-[300px] lg:max-w-[360px]">
          <label className="relative block">
            <span className="sr-only">선물 고민 검색</span>
            <FiSearch
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
              size={17}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="선물 고민 검색"
              className="search-input h-10 px-5 pl-12 text-sm font-semibold placeholder:font-semibold"
            />
          </label>
        </div>

        <div className="flex items-center gap-5">
          <NotificationBell />
          <HeaderUserMenu />
        </div>

        <div className="order-4 flex w-full items-center gap-5 overflow-x-auto md:hidden">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive =
              label === "질문 피드" &&
              location.pathname.startsWith(ROUTES.QUESTIONS);

            return (
              <Link
                key={label}
                to={to}
                className={`shrink-0 py-1 text-sm transition-colors ${
                  isActive
                    ? "font-extrabold text-text"
                    : "font-bold text-text-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
