import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({
  notifications, loading,
  handleMarkAllAsRead, updateReadStatus,
  handleDeleteNotification, handleDeleteAllNotifications,
}) => {
  return (
    <div className="w-[380px] rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <h2 className="text-base font-semibold text-gray-900">알림</h2>

        <div className="flex gap-1.5">                                                                                                                               
            <button onClick={handleMarkAllAsRead} className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              모두 읽음
            </button>                 
            <button onClick={handleDeleteAllNotifications} className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              전체 삭제
            </button>        
          </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-400">불러오는 중...</p>
        ) : notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">새로운 알림이 없습니다.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              updateReadStatus={updateReadStatus}
              onDelete={handleDeleteNotification} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;