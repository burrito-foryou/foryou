import useNotificationItem from "../hooks/useNotificationItem";
import { NOTIFICATION_STYLE, DEFAULT_STYLE } from "../../../shared/constants/notificationStyle";
import timeAgo from "../../../shared/utils/timeAgo";
import { FiX } from "react-icons/fi"

const NotificationItem = ({ notification, updateReadStatus, onDelete }) => {
  const { handleClick } = useNotificationItem(notification, updateReadStatus);

  const style = NOTIFICATION_STYLE[notification.type] || DEFAULT_STYLE;

  const Icon = style.icon;
  const isRead = notification.isRead;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 삭제 버튼 클릭이 알림 카드 클릭으로 안 번지게                                                                                         
    onDelete(notification.id);
  };

  return (
    <div onClick={handleClick} className={`group relative flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition-colors
      ${isRead ? "bg-white hover:bg-gray-50" : `${style.cardBg} hover:brightness-[0.98]`}`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full
          ${isRead ? "bg-gray-100 text-gray-400" : `${style.iconBg} ${style.iconColor}`}`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1 pr-4">
        <p className="text-[12px] leading-snug text-gray-800">
          <span className="font-bold text-gray-900">{notification.senderNickname}</span>
          {notification.messagePrefix}
          {notification.questionTitle} 
          {notification.questionTitle && (
            <span className="font-bold text-gray-900">{notification.questionTitle}</span>
          )}
          {notification.messageSuffix}
        </p>

        <span className="mt-1 block text-[12px] text-gray-500">
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      <span
        className={`absolute right-3 top-3.5 h-1.5 w-1.5 rounded-full bg-pink-500 group-hover:hidden
          ${isRead ? "hidden" : "block"}`}
      />

      <button onClick={handleDeleteClick} className="absolute right-2.5 top-2.5 rounded-full p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100">
        <FiX size={13} />
      </button>
    </div>
  );
};

export default NotificationItem;