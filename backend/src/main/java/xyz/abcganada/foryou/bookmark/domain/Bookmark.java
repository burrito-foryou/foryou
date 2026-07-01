package xyz.abcganada.foryou.bookmark.domain;

import jakarta.persistence.*;
import xyz.abcganada.foryou.member.domain.Member;

@Entity
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}

