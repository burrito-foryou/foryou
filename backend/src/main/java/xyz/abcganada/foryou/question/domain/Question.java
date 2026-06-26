package xyz.abcganada.foryou.question.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import xyz.abcganada.foryou.global.common.BaseEntity;
import xyz.abcganada.foryou.member.domain.Member;

// 의존성 때문에 만들어 놓은 임시파일 현민님의 파일로 교체 예정
@Entity
@Table(name = "questions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Question extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "like_count")
    private Long likeCount;

    // 채택된 답변 ID (questions 테이블에 비정규화로 관리)
    // accepted_answer_id가 null이면 미채택, not null이면 채택 완료
    @Column(name = "accepted_answer_id")
    private Long acceptedAnswerId;

    /**
     * 답변 채택 시 채택 답변 ID를 기록한다.
     */
    public void accept(Long answerId) {
        this.acceptedAnswerId = answerId;
    }

    public boolean isAuthor(Long memberId) {
        return this.member.getId().equals(memberId);
    }

}
