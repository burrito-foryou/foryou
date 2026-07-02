import { useCallback, useEffect, useState } from "react";
import { getNotifications, markAllAsRead, deleteNotification, deleteAllNotifications, } from "../api/notificationApi";
import useNotificationSse from "./useNotificationSse";

// 알림 목록 전체
const useNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      setError(null); // 새로고침 시 이전 error 초기화

      const data = await getNotifications();
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
      await markAllAsRead();

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

  const handleDeleteNotification = async (notificationId) => {                                                                                                       
    try {                                                                                                                                                            
      await deleteNotification(notificationId);                                                                                                                      
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));                                                                                       
    } catch (error) {                                                                                                                                                
      console.error(error);                                                                                                                                          
    }                                                                                                                                                                
  };                                                                                                                                                                 
                                                                                                                                                                     
  const handleDeleteAllNotifications = async () => {                                                                                                                 
    try {                                                                                                                                                            
      await deleteAllNotifications();                                                                                                                                
      setNotifications([]);                                                                                                                                          
    } catch (error) {                                                                                                                                                
      console.error(error);                                                                                                                                          
    }                                                                                                                                                                
  };       

  // NotificationBadge에서 사용
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useNotificationSse((newNotification) => {                                                                                                                        
      setNotifications((prev) => [newNotification, ...prev]); // SSE에게 알림이 오면 setNotification 실행하라고 등록                                                                                                
    }); 

  return {notifications, loading, error, unreadCount,
    reload: fetchNotifications,
    updateReadStatus,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleDeleteAllNotifications,
  };
};

export default useNotificationList;