package xyz.abcganada.foryou.global.security.jwt;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@RedisHash("refreshToken")
@RequiredArgsConstructor
public class RefreshToken {
    @Id
    private final Long memberId;

    private final String token;

    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private final Long expiration;
}
