package xyz.abcganada.foryou.notification.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import xyz.abcganada.foryou.member.domain.Member;

import java.time.Instant;
import java.util.Optional;

@Entity
@Table(name = "notifications")
@Getter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Member receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = true) // Member의 sender_id ON DELETE SET NULL 이므로 null 가능
    private Member sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Builder(access = AccessLevel.PRIVATE) // 생성 경로 강제 위해 Builder는 private
    public Notification(Member receiver, Member sender, NotificationType type, TargetType targetType, Long targetId, Long questionId, String content) {
        this.receiver = receiver;
        this.sender = sender;
        this.type = type;
        this.targetType = targetType;
        this.targetId = targetId;
        this.questionId = questionId;
        this.content = content;
        this.isRead = false;
        this.createdAt = Instant.now();
    }

    // 현재는 JPQL UPDATE로 읽음 처리하지만,
    // 엔티티 기반 변경이 필요할 경우 사용할 메서드
    public void markAsRead() {
        this.isRead = true;
    }

    public static Optional<Notification> create(Member receiver, Member sender, NotificationType type, TargetType targetType, Long targetId, Long questionId) {
        if (receiver.getId().equals(sender.getId())) {
            return Optional.empty();
        }

        return Optional.of(Notification.builder()
                .receiver(receiver)
                .sender(sender)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .questionId(questionId)
                .content(type.buildContent(sender.getNickname()))
                .build());
    }

}
