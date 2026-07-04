package xyz.abcganada.foryou.answer.rest.response;

import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.question.domain.Question;

import java.time.Instant;

public record AnswerMyResponse(
    Long id,
    Long questionId,
    String questionTitle,
    String giftName,
    String priceRange,
    String content,
    Long likeCount,
    boolean accepted,
    Instant createdAt
) {
    public static AnswerMyResponse from(Answer answer, Question question) {
        return new AnswerMyResponse(
            answer.getId(),
            question.getId(),
            question.getTitle(),
            answer.getGiftName(),
            answer.getPriceRange(),
            answer.getContent(),
            answer.getLikeCount(),
            answer.isAccepted(),
            answer.getCreatedAt()
        );
    }
}
