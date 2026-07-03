package xyz.abcganada.foryou.answer.rest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import xyz.abcganada.foryou.answer.domain.Answer;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AnswerResponse {

    private Long id;
    private Long questionId;
    private Long memberId;
    private String memberNickname;
    private String giftName;
    private String priceRange;
    private String content;
    private Long likeCount;
    private boolean accepted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnswerResponse from(Answer answer) {
        return AnswerResponse.builder()
                .id(answer.getId())
                .questionId(answer.getQuestion().getId())
                .memberId(answer.getMember().getId())
                .memberNickname(answer.getMember().getNickname())
                .giftName(answer.getGiftName())
                .priceRange(answer.getPriceRange())
                .content(answer.getContent())
                .likeCount(answer.getLikeCount())
                .accepted(answer.isAccepted())
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}
