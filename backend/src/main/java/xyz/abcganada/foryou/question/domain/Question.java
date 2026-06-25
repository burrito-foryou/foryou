package xyz.abcganada.foryou.question.domain;

import jakarta.persistence.*;
import lombok.*;
import xyz.abcganada.foryou.global.common.BaseEntity;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.tag.Tag;

import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestionStatus status;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "like_count", nullable = false)
    private long likeCount;

    @Column(name = "accepted_answer_id")
    private Long acceptedAnswerId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "question_tags",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @Builder
    public Question(Member member, String title, String content, List<Tag> tags) {
        this.member = member;
        this.title = title;
        this.content = content;
        this.status = QuestionStatus.PENDING;
        this.viewCount = 0;
        this.likeCount = 0;
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
    }

    // 질문 수정
    public void update(String title, String content, List<Tag> tags) {
        this.title = title;
        this.content = content;
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
    }

    // 조회수 증가
    public void incrementViewCount() {
        this.viewCount++;
    }

    // 좋아요 수 증가
    public void incrementLikeCount() {
        this.likeCount++;
    }

    // 좋아요 수 감소
    public void decrementLikeCount() {
        if (this.likeCount > 0) this.likeCount--;
    }

    // 답변 채택
    public void accept(Long answerId) {
        this.acceptedAnswerId = answerId;
        this.status = QuestionStatus.ACCEPTED;
    }

    // 첫 답변 등록 시 상태 변경
    public void markAsAnswered() {
        if (this.status == QuestionStatus.PENDING) {
            this.status = QuestionStatus.ANSWERED;
        }
    }
}