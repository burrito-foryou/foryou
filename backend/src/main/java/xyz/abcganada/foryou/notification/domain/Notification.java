package xyz.abcganada.foryou.notification.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import xyz.abcganada.foryou.member.domain.Member;

import java.time.LocalDateTime;

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
    private LocalDateTime createdAt;

    @Builder
    public Notification(Member receiver, Member sender, NotificationType type, TargetType targetType, Long targetId, Long questionId, String content) {
        this.receiver = receiver;
        this.sender = sender;
        this.type = type;
        this.targetType = targetType;
        this.targetId = targetId;
        this.questionId = questionId;
        this.content = content;
        this.isRead = false;
        // TODO 운영 서버 타임존 미설정 시 KST 불일치 가능
        this.createdAt = LocalDateTime.now();
    }

    // Service에서 직접 필드 변경 시 Setter 가능해야 함 - 어디서든 변경 가능
    // Entity 메서드 사용 - setter 불필요
    public void markAsRead() {
        this.isRead = true;
    }

}
