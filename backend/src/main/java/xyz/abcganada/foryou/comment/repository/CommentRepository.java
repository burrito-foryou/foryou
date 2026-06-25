package xyz.abcganada.foryou.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.comment.domain.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 답변의 댓글을 등록일 오름차순으로 조회
    List<Comment> findByAnswerIdOrderByCreatedAtAsc(Long answerId);
}
