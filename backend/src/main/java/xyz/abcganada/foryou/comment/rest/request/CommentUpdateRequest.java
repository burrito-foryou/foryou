package xyz.abcganada.foryou.comment.rest.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentUpdateRequest {

    @NotBlank(message = "내용은 필수입니다.")
    @Size(max = 50, message = "댓글은 50자 이하로 입력해주세요.")
    private String content;
}
