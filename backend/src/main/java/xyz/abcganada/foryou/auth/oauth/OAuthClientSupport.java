package xyz.abcganada.foryou.auth.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Component;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;

@Component
@RequiredArgsConstructor
public class OAuthClientSupport {

    private final ObjectProvider<ClientRegistrationRepository> clientRegistrationRepositoryProvider;

    public ClientRegistration getRegistration(String registrationId) {
        ClientRegistrationRepository repository = clientRegistrationRepositoryProvider.getIfAvailable();

        if (repository == null) {
            throw new BusinessException(ErrorCode.OAUTH_CLIENT_NOT_CONFIGURED);
        }

        ClientRegistration registration = repository.findByRegistrationId(registrationId);

        if (registration == null) {
            throw new BusinessException(ErrorCode.OAUTH_CLIENT_NOT_CONFIGURED);
        }

        return registration;
    }

    public HttpEntity<Void> createBearerRequest(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        return new HttpEntity<>(headers);
    }
}
