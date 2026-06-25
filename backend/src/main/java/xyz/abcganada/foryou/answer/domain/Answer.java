package xyz.abcganada.foryou.answer.domain;

import jakarta.persistence.*;
import lombok.*;
import xyz.abcganada.foryou.global.common.BaseEntity;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.question.domain.Question;

@Entity
@Table(name = "answers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Answer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "gift_name", nullable = false, length = 100)
    private String giftName;

    @Column(name = "price_range", length = 50)
    private String priceRange;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "like_count", nullable = false)
    private Long likeCount;

    // boolean 필드는 Lombok @Getter가 isAccepted()로 자동 생성
    @Column(name = "is_accepted", nullable = false)
    private boolean accepted;
}
