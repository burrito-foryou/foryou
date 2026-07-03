package xyz.abcganada.foryou.auth.oauth.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoTokenResponse(
    @JsonProperty("access_token")
    String accessToken
) {
}
