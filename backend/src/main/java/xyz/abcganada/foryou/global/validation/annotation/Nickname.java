package xyz.abcganada.foryou.global.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.lang.annotation.*;

@NotBlank(message = "닉네임은 필수입니다.")
@Pattern(
    regexp = "^[가-힣a-zA-Z0-9]{2,20}$",
    message = "닉네임은 2자 이상 20자 이하이며, 한글, 영문, 숫자만 사용할 수 있습니다."
)
@Documented
@Constraint(validatedBy = {})
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
public @interface Nickname {
    String message() default "닉네임 형식이 올바르지 않습니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
