package xyz.abcganada.foryou.notification.rest.response;

import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String senderNickname,
        NotificationType type,
        TargetType targetType,
        Long targetId,
        Long questionId,
        String content,
        boolean isRead,
        LocalDateTime createdAt
) {
    // static 메서드 - Entity -> Response DTO 변환
    public static NotificationResponse from(Notification notification) {

        Member sender = notification.getSender();

        return new NotificationResponse(
                notification.getId(),
                sender != null ? sender.getNickname() : "탈퇴한 사용자",
                notification.getType(),
                notification.getTargetType(),
                notification.getTargetId(),
                notification.getQuestionId(),
                notification.getContent(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
