package xyz.abcganada.foryou.like.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import xyz.abcganada.foryou.member.domain.Member;

import java.time.Instant;

@Entity
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "member_id",
                        "target_type",
                        "target_id"
                }))
@Getter
@Setter
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_id",  nullable = false)
    private Long targetId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Builder
    public Like(Member member, TargetType targetType, Long targetId) {
        this.member = member;
        this.targetType = targetType;
        this.targetId = targetId;
        this.createdAt = Instant.now();
    }
}
