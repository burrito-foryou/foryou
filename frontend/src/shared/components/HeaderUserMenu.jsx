import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { ROUTES } from "../constants/routes";
import useAuthStore from "../../features/auth/store/authStore";
import { logout } from "../../features/auth/api/authApi";
import { getMyInfo } from "../../features/user/api/memberApi";
import LogoutConfirmModal from "./LogoutConfirmModal";
import Avatar from "./Avatar";

const DROPDOWN_MENU = [
  { label: "마이페이지", to: ROUTES.MY_PAGE, icon: FiUser },
  { label: "계정 정보", to: ROUTES.MY_ACCOUNT, icon: FiSettings },
];

const HeaderUserMenu = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const nickname = useAuthStore((state) => state.nickname);
  const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setMemberInfo = useAuthStore((state) => state.setMemberInfo);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const displayName = nickname ?? "마이페이지";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    getMyInfo()
      .then((member) => {
        if (!ignore) setMemberInfo(member);
      })
      .catch(() => {
        // 헤더 프로필 조회 실패는 화면 진입을 막지 않는다.
      });

    return () => {
      ignore = true;
    };
  }, [setMemberInfo, token]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 로그아웃 API 호출이 실패해도 로컬 로그아웃은 진행한다.
    } finally {
      clearAuth();
      setIsLogoutModalOpen(false);
      setIsOpen(false);
      navigate(ROUTES.HOME);
    }
  };

  if (!token) {
    return (
      <>
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-extrabold text-text transition-colors hover:text-primary"
        >
          로그인
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex h-10 items-center justify-center rounded-full bg-text px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary"
        >
          시작하기
        </Link>
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 items-center gap-2 rounded-full px-2.5 pr-3 text-sm font-extrabold text-text transition-colors hover:bg-surface"
      >
        <Avatar
          src={profileImageUrl}
          name={displayName}
          size={28}
          textSize="text-xs"
          bordered
        />
        <span>{nickname ? `${nickname}님` : "마이페이지"}</span>
        <FiChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-background p-1.5 shadow-soft">
          {DROPDOWN_MENU.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-text transition-colors hover:bg-surface"
            >
              <Icon size={16} className="text-text-muted" />
              {label}
            </Link>
          ))}
          <div className="my-1.5 border-t border-border" />
          <button
            onClick={() => {
              setIsOpen(false);
              setIsLogoutModalOpen(true);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-error transition-colors hover:bg-surface"
          >
            <FiLogOut size={16} />
            로그아웃
          </button>
        </div>
      )}

      {isLogoutModalOpen && (
        <LogoutConfirmModal
          onConfirm={handleLogout}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HeaderUserMenu;
