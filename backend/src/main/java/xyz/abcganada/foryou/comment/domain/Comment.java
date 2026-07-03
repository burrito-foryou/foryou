package xyz.abcganada.foryou.comment.domain;

import jakarta.persistence.*;
import lombok.*;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.global.common.BaseEntity;
import xyz.abcganada.foryou.member.domain.Member;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "like_count", nullable = false)
    private Long likeCount;

    public void update(String content) {
        this.content = content;
    }

    // 좋아요 수 증가
    public void incrementLikeCount() {
        this.likeCount++;
    }

    // 좋아요 수 감소
    public void decrementLikeCount() {
        if(this.likeCount > 0) {
            this.likeCount--;
        }
    }
}
