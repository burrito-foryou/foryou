package xyz.abcganada.foryou.bookmark.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.bookmark.domain.Bookmark;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // 내가 북마크한 질문 목록 조회 (페이징)
    // tags는 컬렉션이라 fetch 대상에서 제외 (Question.tags의 @BatchSize로 별도 처리)
    @EntityGraph(attributePaths = {"question"})
    Page<Bookmark> findByMemberId(Long memberId, Pageable pageable);

    // 북마크 추가 전 중복 체크
    boolean existsByMemberIdAndQuestionId(Long memberId, Long questionId);

    // 북마크 취소할때 해당 엔티티 찾아서 삭제
    Optional<Bookmark> findByMemberIdAndQuestionId(Long memberId, Long questionId);

}
