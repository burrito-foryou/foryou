package xyz.abcganada.foryou.auth.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import xyz.abcganada.foryou.global.validation.annotation.Nickname;
import xyz.abcganada.foryou.global.validation.annotation.Password;

public record SignupRequest(
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    String email,

    @Password
    String password,

    @Nickname
    String nickname
) {
}
