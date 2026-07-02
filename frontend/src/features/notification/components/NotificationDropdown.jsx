import NotificationItem from "./NotificationItem";
import useNotificationList from "../hooks/useNotificationList";

const NotificationDropdown = ({ receiverId }) => {
  const {
    notifications,
    loading,
    handleMarkAllAsRead,
    updateReadStatus,
  } = useNotificationList(receiverId);

  return (
    <div className="w-[380px] rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold">알림</h2>

        <button
          onClick={handleMarkAllAsRead}
          className="rounded-md border px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
        >
          모두 읽음
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-500">
            불러오는 중...
          </p>
        ) : notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">
            새로운 알림이 없습니다.
          </p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              receiverId={receiverId}
              updateReadStatus={updateReadStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;