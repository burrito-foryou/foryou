package xyz.abcganada.foryou.auth.oauth.google;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;
import xyz.abcganada.foryou.auth.oauth.OAuthClient;
import xyz.abcganada.foryou.auth.oauth.OAuthClientSupport;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleOAuthClient implements OAuthClient {

    private static final String REGISTRATION_ID = "google";

    private final RestOperations restOperations;
    private final OAuthClientSupport oAuthClientSupport;

    @Override
    public AuthProvider provider() {
        return AuthProvider.GOOGLE;
    }

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        String accessToken = requestAccessToken(code);
        GoogleUserResponse response = requestGoogleUser(accessToken);

        return response.toOAuthUserInfo();
    }

    private String requestAccessToken(String code) {
        ClientRegistration registration = oAuthClientSupport.getRegistration(REGISTRATION_ID);
        GoogleTokenResponse response = requestToken(registration, code);

        if (response == null || !StringUtils.hasText(response.accessToken())) {
            throw new BusinessException(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED);
        }

        return response.accessToken();
    }

    private GoogleTokenResponse requestToken(ClientRegistration registration, String code) {
        log.debug("[Auth] 토큰 요청 - tokenUri: {}, redirectUri: {}", registration.getProviderDetails().getTokenUri(), registration.getRedirectUri());
        try {
            GoogleTokenResponse response = restOperations.postForObject(
                registration.getProviderDetails().getTokenUri(),
                createTokenRequest(registration, code),
                GoogleTokenResponse.class
            );
            log.debug("[Auth] 토큰 요청 성공");
            return response;
        } catch (RestClientException e) {
            log.error("[Auth] 토큰 요청 실패 - {}", e.getMessage());
            throw new BusinessException(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED);
        }
    }

    private HttpEntity<MultiValueMap<String, String>> createTokenRequest(
        ClientRegistration registration,
        String code
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", registration.getAuthorizationGrantType().getValue());
        body.add("client_id", registration.getClientId());
        body.add("redirect_uri", registration.getRedirectUri());
        body.add("code", code);

        if (StringUtils.hasText(registration.getClientSecret())) {
            body.add("client_secret", registration.getClientSecret());
        }

        return new HttpEntity<>(body, headers);
    }

    private GoogleUserResponse requestGoogleUser(String accessToken) {
        ClientRegistration registration = oAuthClientSupport.getRegistration(REGISTRATION_ID);

        log.debug("[Auth] 구글 유저 정보 요청 - userInfoUri: {}", registration.getProviderDetails().getUserInfoEndpoint().getUri());
        try {
            GoogleUserResponse response = restOperations.exchange(
                registration.getProviderDetails().getUserInfoEndpoint().getUri(),
                HttpMethod.GET,
                oAuthClientSupport.createBearerRequest(accessToken),
                GoogleUserResponse.class
            ).getBody();

            if (response == null || !response.isValid()) {
                log.error("[Auth] 구글 유저 정보 유효하지 않음 - response: {}", response);
                throw new BusinessException(ErrorCode.OAUTH_USER_INFO_INVALID);
            }

            log.debug("[Auth] 구글 유저 정보 요청 성공");
            return response;
        } catch (RestClientException e) {
            log.error("[Auth] 구글 유저 정보 요청 실패 - {}", e.getMessage());
            throw new BusinessException(ErrorCode.OAUTH_USER_INFO_REQUEST_FAILED);
        }
    }
}
