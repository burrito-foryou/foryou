import { useCallback, useEffect, useState } from "react";
import { getNotifications, markAllAsRead, } from "../api/notificationApi";

// 알림 목록 전체
const useNotificationList = (receiverId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      setError(null); // 새로고침 시 이전 error 초기화

      const data = await getNotifications(receiverId);
      setNotifications(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // API 호출
    fetchNotifications();
  }, [fetchNotifications]);

  // useNotificationItem의 markAsRead에서 사용 위함
  const updateReadStatus = (notificationId) => { // notification: 클릭한 알림, prev: 현재 알림 목록
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId // 알림 목록 중 클릭한 알림 찾기
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(receiverId);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {notifications, loading, error, 
    reload: fetchNotifications, // ?
    updateReadStatus,
    handleMarkAllAsRead,
  };
};

export default useNotificationList;