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
import xyz.abcganada.foryou.notification.rest.response.NotificationResponse;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSseService notificationSseService;

    // 1. 알림 생성
    @Transactional
    public void createNotification(
            Member receiver,
            Member sender,
            NotificationType type,
            TargetType targetType,
            Long targetId,
            Long questionId
    ) {
        // 자기 자신에게는 알림 X
        if (receiver.getId().equals(sender.getId())) {
            return;
        }

        // 알림 메시지 조합
        String content = type.buildContent(sender.getNickname());

        // DB에 알림 저장
        Notification notification = notificationRepository.save(Notification.builder()
                .receiver(receiver)
                .sender(sender)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .questionId(questionId)
                .content(content)
                .build());

        // SSE로 알림 전송
        // TODO DB 저장 -> SSE 전송 -> 트랜잭션 커밋 시 문제 발생 가능 : DB commit 성공 후 SSE send 되도록 개선 필요
        notificationSseService.send(receiver.getId(),
                NotificationResponse.from(notification));
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

    // 6. 알림 전체 삭제
    @Transactional
    public void deleteAllNotifications(Long receiverId) {
        int deleted = notificationRepository.deleteByReceiverId(receiverId);
        log.info("{}개의 알림 삭제", deleted);
    }

}
