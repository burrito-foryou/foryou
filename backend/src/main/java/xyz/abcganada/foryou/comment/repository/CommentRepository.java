package xyz.abcganada.foryou.comment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.comment.domain.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 답변의 댓글을 등록일 오름차순으로 조회
    // @EntityGraph로 answer, member를 JOIN하여 N+1 방지
    @EntityGraph(attributePaths = {"answer", "member"})
    List<Comment> findByAnswerIdOrderByCreatedAtAsc(Long answerId);

    // 내가 작성한 댓글 목록 조회 (페이징)
    @EntityGraph(attributePaths = {"answer", "member"})
    Page<Comment> findByMemberId(Long memberId, Pageable pageable);
}
