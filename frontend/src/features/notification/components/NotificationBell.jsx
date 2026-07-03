import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import useAuthStore from "../../auth/store/authStore";
import useNotificationList from "../hooks/useNotificationList";
import NotificationDropdown from "./NotificationDropdown";
import NotificationBadge from "./NotificationBadge";

const NotificationBell = () => {
  const token = useAuthStore((state) => state.token);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationData = useNotificationList();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) { // dropdownRef로 영역 밖 클릭하면 드롭다운 닫기 (false)
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // 마우스 누를 때마다 handleClickOutside 함수 실행 등록
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-md p-1.5 transition-colors hover:bg-surface"
      >
        <FiBell size={20} className="text-gray-600" />
        <NotificationBadge count={notificationData.unreadCount} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2">
          <NotificationDropdown {...notificationData} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;