package xyz.abcganada.foryou.comment.rest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import xyz.abcganada.foryou.comment.domain.Comment;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private Long answerId;
    private Long memberId;
    private String memberNickname;
    private String content;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .answerId(comment.getAnswer().getId())
                .memberId(comment.getMember().getId())
                .memberNickname(comment.getMember().getNickname())
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
