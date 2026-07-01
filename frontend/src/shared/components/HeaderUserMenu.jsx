import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { ROUTES } from "../constants/routes";
import useAuthStore from "../../features/auth/store/authStore";

const DROPDOWN_MENU = [
  { label: "알림", to: ROUTES.NOTIFICATIONS },
  { label: "마이페이지", to: ROUTES.MY_PAGE },
  { label: "계정 정보", to: ROUTES.MY_ACCOUNT },
];

const HeaderUserMenu = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const nickname = useAuthStore((state) => state.nickname);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    navigate(ROUTES.HOME);
  };

  if (!token) {
    return (
      <Link
        to={ROUTES.LOGIN}
        className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary-hover"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-bold text-primary hover:bg-surface transition-colors"
      >
        {nickname ? `${nickname}님` : "마이페이지"}
        <FiChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-border bg-background p-1.5 shadow-lg">
          {DROPDOWN_MENU.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm text-text hover:bg-surface transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="my-1.5 border-t border-border" />
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-400 hover:bg-surface transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderUserMenu;
