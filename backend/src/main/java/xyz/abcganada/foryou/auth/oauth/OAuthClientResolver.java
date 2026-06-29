package xyz.abcganada.foryou.auth.oauth;

import org.springframework.stereotype.Component;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class OAuthClientResolver {

    private final Map<AuthProvider, OAuthClient> clients;

    public OAuthClientResolver(List<OAuthClient> clients) {
        this.clients = clients.stream()
            .collect(Collectors.toMap(OAuthClient::provider, Function.identity()));
    }

    public OAuthClient resolve(AuthProvider provider) {
        OAuthClient client = clients.get(provider);

        if (client == null) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
        }

        return client;
    }
}
