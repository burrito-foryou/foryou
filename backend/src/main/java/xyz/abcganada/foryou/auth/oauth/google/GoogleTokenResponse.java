package xyz.abcganada.foryou.auth.oauth.google;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleTokenResponse(
    @JsonProperty("access_token")
    String accessToken
) {
}
