import useNotificationItem from "../hooks/useNotificationItem";
import { NOTIFICATION_STYLE } from "../../../shared/constants/notificationStyle";
import timeAgo from "../../../shared/utils/timeAgo";
import { FiX } from "react-icons/fi"

const NotificationItem = ({ notification, updateReadStatus, onDelete }) => {
  const { handleClick } = useNotificationItem(notification, updateReadStatus);

  const style = NOTIFICATION_STYLE[notification.type];

  const Icon = style.icon;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 삭제 버튼 클릭이 알림 카드 클릭으로 안 번지게                                                                                         
    onDelete(notification.id);
  };

  return (
    <div onClick={handleClick} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50
      ${notification.isRead
          ? "border-gray-200 bg-white"
          : `${style.bg} ${style.border}`
        }`}>
      <div className={`rounded-full border p-2 ${notification.isRead
            ? "border-gray-300 text-gray-400"
            : `${style.border} ${style.iconColor}`
          }`}>
        <Icon size={16} />
      </div>

      <div className="flex-1">
        <p className="text-[10px] text-text">
          {notification.content}
        </p>

        <span className="text-[10px] text-gray-500">
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      <button onClick={handleDeleteClick} className="text-gray-400 hover:text-red-500">
        <FiX size={14} />
      </button>
    </div>
  );
};

export default NotificationItem;