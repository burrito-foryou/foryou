package xyz.abcganada.foryou.bookmark.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.bookmark.domain.Bookmark;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // 내가 북마크한 질문 목록 조회 (페이징)
    // tags는 컬렉션이라 fetch 대상에서 제외 (Question.tags의 @BatchSize로 별도 처리)
    @EntityGraph(attributePaths = {"question"})
    Page<Bookmark> findByMemberId(Long memberId, Pageable pageable);
}
