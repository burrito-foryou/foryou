package xyz.abcganada.foryou.bookmark.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.question.domain.Question;

import java.time.Instant;

@Entity
@Table(name = "bookmarks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "question_id"}))
@Getter
@NoArgsConstructor
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Builder
    public Bookmark(Member member, Question question) {
        this.member = member;
        this.question = question;
        this.createdAt = Instant.now();
    }




}
