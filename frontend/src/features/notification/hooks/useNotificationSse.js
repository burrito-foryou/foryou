import { useEffect } from "react";
import useAuthStore from "../../auth/store/authStore";

const useNotificationSse = (onNotification) => {
  const token = useAuthStore((state) => state.token);

    useEffect(() => {                                                                                                                                                  
    if (!token) return; // 로그인 안 된 상태에서는 SSE 연결 시도 X                                                                                                                                          
                                                                                                                                                                     
    let tabId = sessionStorage.getItem("sse-tab-id"); // 탭마다 고유, 새로고침에도 유지
    if (!tabId) {
      tabId = crypto.randomUUID();
      sessionStorage.setItem("sse-tab-id", tabId);
    }

    const eventSource = new EventSource(`/api/notifications/subscribe?token=${token}&tabId=${tabId}`); // 연결 생성                                                                           
                                                                                                                                                                     
    eventSource.addEventListener("notification", (e) => { // 서버에서 SSE 이벤트 도착 시 listener 실행                                                                                                    
      const data = JSON.parse(e.data);                                                                                                                               
      if (data.status === "connected") return; // 더미 연결 확인 이벤트 무시                                                                                         
      onNotification(data); // 콜백 함수 실행 -> setNotifications                                                                                                               
    });                                                                                                                                                              
                                                                                                                                                                     
    return () => eventSource.close();                                                                                                                               
  }, [token]); // 로그인 상태 바뀔 때만 재연결
};

export default useNotificationSse;