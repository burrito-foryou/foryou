package xyz.abcganada.foryou.bookmark.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.bookmark.domain.Bookmark;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Page<Bookmark> findByMemberId(Long memberId, Pageable pageable);

    // 북마크 추가 전 중복 체크
    boolean existsByMemberIdAndQuestionId(Long memberId, Long questionId);

    // 북마크 취소할때 해당 엔티티 찾아서 삭제
    Optional<Bookmark> findByMemberIdAndQuestionId(Long memberId, Long questionId);

}
