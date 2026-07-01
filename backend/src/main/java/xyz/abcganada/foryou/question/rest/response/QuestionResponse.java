package xyz.abcganada.foryou.question.rest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import xyz.abcganada.foryou.question.domain.Question;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String title;
    private String content;
    private Long memberId;
    private String memberNickname;
    private long viewCount;
    private long likeCount;
    private long answerCount;
    private Long acceptedAnswerId;
    private List<String> tagNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static QuestionResponse from(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .content(question.getContent())
                .memberId(question.getMember().getId()) // N+1 문제
                .memberNickname(question.getMember().getNickname())
                .viewCount(question.getViewCount())
                .likeCount(question.getLikeCount())
                .answerCount(question.getAnswerCount())
                .acceptedAnswerId(question.getAcceptedAnswerId())
                .tagNames(question.getTags().stream()
                        .map(tag -> tag.getName())
                        .toList())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}