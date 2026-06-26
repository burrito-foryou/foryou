package xyz.abcganada.foryou.auth.rest.response;

import xyz.abcganada.foryou.member.domain.Member;

public record SignupResponse(
    Long memberId,
    String email,
    String nickname
) {
    public static SignupResponse from(Member member) {
        return new SignupResponse(member.getId(), member.getEmail(), member.getNickname());
    }
}
