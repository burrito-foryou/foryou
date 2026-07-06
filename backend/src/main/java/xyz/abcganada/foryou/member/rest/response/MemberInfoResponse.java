package xyz.abcganada.foryou.member.rest.response;

import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;

import java.time.Instant;

public record MemberInfoResponse(
    Long memberId,
    String nickname,
    String email,
    String profileImageUrl,
    AuthProvider provider,
    Instant createdAt
) {
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
            member.getId(),
            member.getNickname(),
            member.getEmail(),
            member.getProfileImageUrl(),
            member.getProvider(),
            member.getCreatedAt()
        );
    }
}
