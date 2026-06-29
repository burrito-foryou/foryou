package xyz.abcganada.foryou.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.notification.domain.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 사용자별 알림 목록 최신순 조회
    @Query("""
            select n
                from Notification n
                left join fetch n.sender
                where n.receiver.id = :receiverId
                order by n.createdAt desc
            """)
    List<Notification> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    // 알림 단건 읽음 처리
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update Notification n set n.isRead = true
                    where n.id = :notificationId
                    and n.receiver.id = :receiverId
        """)
    int markAsRead(@Param("notificationId") Long notificationId, @Param("receiverId") Long receiverId);

    // 알림 전체 읽음 처리
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update Notification n set n.isRead = true 
                    where n.receiver.id = :receiverId and n.isRead = false
        """)
    int markAllAsRead(@Param("receiverId") Long receiverId);

    // 알림 단건 삭제
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            delete from Notification n
                    where n.id = :notificationId
                    and n.receiver.id = :receiverId
        """)
    int deleteByIdAndReceiverId(@Param("notificationId") Long notificationId, @Param("receiverId") Long receiverId);

    // 알림 전체 삭제
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            delete from Notification n
                    where n.receiver.id = :receiverId
        """)
    int deleteByReceiverId(@Param("receiverId") Long receiverId);
}
