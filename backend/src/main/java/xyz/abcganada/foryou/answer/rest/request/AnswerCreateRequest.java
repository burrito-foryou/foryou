package xyz.abcganada.foryou.answer.rest.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnswerCreateRequest {

    @NotBlank(message = "선물 이름은 필수입니다.")
    private String giftName;

    private String priceRange;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;
}
