package xyz.abcganada.foryou.bookmark.rest.response;

import xyz.abcganada.foryou.bookmark.domain.Bookmark;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.tag.Tag;

import java.time.Instant;
import java.util.List;

public record BookmarkMyResponse(
    Long questionId,
    String title,
    List<String> tagNames,
    long answerCount,
    Instant createdAt
) {
    public static BookmarkMyResponse from(Bookmark bookmark, Question question) {
        return new BookmarkMyResponse(
            question.getId(),
            question.getTitle(),
            question.getTags().stream().map(Tag::getName).toList(),
            question.getAnswerCount(),
            bookmark.getCreatedAt()
        );
    }
}
