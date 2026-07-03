package xyz.abcganada.foryou.question.rest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import xyz.abcganada.foryou.question.domain.Question;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class QuestionDetailResponse {

    private Long id;
    private String title;
    private String content;
    private Long memberId;
    private String memberNickname;
    private long viewCount;
    private long likeCount;
    private long answerCount;
    private Long acceptedAnswerId;
    private List<TagInfo> tags;
    private Instant createdAt;
    private Instant updatedAt;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class TagInfo {
        private Long id;
        private String name;
        private String type;
    }

    public static QuestionDetailResponse from(Question question) {
        return QuestionDetailResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .content(question.getContent())
                .memberId(question.getMember().getId())
                .memberNickname(question.getMember().getNickname())
                .viewCount(question.getViewCount())
                .likeCount(question.getLikeCount())
                .answerCount(question.getAnswerCount())
                .acceptedAnswerId(question.getAcceptedAnswerId())
                .tags(question.getTags().stream()
                        .map(t -> TagInfo.builder()
                                .id(t.getId())
                                .name(t.getName())
                                .type(t.getType().name())
                                .build())
                        .toList())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}