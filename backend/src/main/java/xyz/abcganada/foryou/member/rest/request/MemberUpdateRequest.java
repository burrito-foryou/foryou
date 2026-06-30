package xyz.abcganada.foryou.member.rest.request;

import xyz.abcganada.foryou.global.validation.annotation.Nickname;

public record MemberUpdateRequest(
    @Nickname
    String nickname
) {
}
