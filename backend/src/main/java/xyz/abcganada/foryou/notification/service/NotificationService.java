package xyz.abcganada.foryou.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;
import xyz.abcganada.foryou.notification.repository.NotificationRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // 1. 알림 생성
    @Transactional
    public void createNotification(
            Member receiver,
            Member sender,
            NotificationType type,
            TargetType targetType,
            Long targetId,
            Long questionId,
            String content
    ) {
        // 자기 자신에게는 알림 X
        if (receiver.getId().equals(sender.getId())) {
            return;
        }

        notificationRepository.save(Notification.builder()
                .receiver(receiver)
                .sender(sender)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .questionId(questionId)
                .content(content)
                .build());
    }

    // 2. 사용자별 알림 목록 최신순 조회
    public List<Notification> getNotifications(Long receiverId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
    }

    // 3. 단건 알림 읽음 처리
    @Transactional
    public void markAsRead(Long notificationId, Long receiverId) {
        int updated = notificationRepository.markAsRead(notificationId, receiverId);
        if (updated == 0) {
            throw new BusinessException(ErrorCode.NOTIFICATION_NOT_FOUND);
        }
    }

    // 4. 전체 알림 읽음 처리
    @Transactional
    public void markAllAsRead(Long receiverId) {
        int updated = notificationRepository.markAllAsRead(receiverId);
        log.info("{}개의 알림 읽음 처리", updated);
    }

    // 5. 단건 알림 삭제
    @Transactional
    public void deleteNotification(Long notificationId, Long receiverId) {
        int deleted = notificationRepository.deleteByIdAndReceiverId(notificationId, receiverId);
        if (deleted == 0) {
            throw new BusinessException(ErrorCode.NOTIFICATION_NOT_FOUND);
        }
    }

}
