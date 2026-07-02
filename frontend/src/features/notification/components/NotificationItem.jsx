import useNotificationItem from "../hooks/useNotificationItem";
import { NOTIFICATION_STYLE } from "../../../shared/constants/notificationStyle";
import { timeAgo } from "../../../shared/utils/timeAgo";

const NotificationItem = ({ notification, updateReadStatus, }) => {
  const { handleClick } = useNotificationItem(
    notification,
    updateReadStatus,
  );

  const style = NOTIFICATION_STYLE[notification.type];

  const Icon = style.icon;

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
        notification.isRead
          ? "border-gray-200 bg-white"
          : `${style.bg} ${style.border}`
      }`}
    >
      <div
        className={`rounded-full border p-2 ${
          notification.isRead
            ? "border-gray-300 text-gray-400"
            : `${style.border} ${style.iconColor}`
        }`}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1">
        <p className="text-sm text-text">
          {notification.content}
        </p>

        <span className="text-xs text-gray-500">
          {timeAgo(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;