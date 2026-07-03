package xyz.abcganada.foryou.comment.rest.response;

import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.question.domain.Question;

import java.time.Instant;

public record CommentMyResponse(
    Long id,
    Long questionId,
    String questionTitle,
    String content,
    Long likeCount,
    Instant createdAt
) {
    public static CommentMyResponse from(Comment comment, Question question) {
        return new CommentMyResponse(
            comment.getId(),
            question.getId(),
            question.getTitle(),
            comment.getContent(),
            comment.getLikeCount(),
            comment.getCreatedAt()
        );
    }
}
