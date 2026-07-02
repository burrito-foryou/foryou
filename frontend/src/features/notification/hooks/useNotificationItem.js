import { useNavigate } from "react-router-dom";
import { markAsRead } from "../api/notificationApi";
import { buildTargetLink } from "../utils/buildTargetLink";

const useNotificationItem = (notification, receiverId, updateReadStatus,) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id, receiverId);

        updateReadStatus(notification.id);
      } catch (error) {
        console.error(error);
      }
    }

    navigate(buildTargetLink(notification)); // 알림 클릭 시 게시글 내 특정 위치 이동 위해 파라미터 조합
  };

  return {handleClick,};
};

export default useNotificationItem;