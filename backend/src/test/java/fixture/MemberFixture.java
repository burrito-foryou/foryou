package fixture;

import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.domain.Role;

public class MemberFixture {

    public static final Long MEMBER_ID = 1L;
    public static final String EMAIL = "test@example.com";
    public static final String PASSWORD = "password123";
    public static final String ENCODED_PASSWORD = "encoded-password";
    public static final String NICKNAME = "tester";

    public static Member member() {
        return member(MEMBER_ID, EMAIL, ENCODED_PASSWORD, NICKNAME);
    }

    public static Member member(Long id, String email, String password, String nickname) {
        return Member.builder()
            .id(id)
            .email(email)
            .password(password)
            .nickname(nickname)
            .role(Role.USER)
            .provider(AuthProvider.FORYOU)
            .build();
    }

    public static Member socialMember(OAuthUserInfo userInfo) {
        return Member.builder()
            .id(MEMBER_ID)
            .email(userInfo.email())
            .nickname(userInfo.nickname())
            .role(Role.USER)
            .provider(userInfo.provider())
            .providerId(userInfo.providerId())
            .build();
    }

    public static Member unsavedMember() {
        return Member.create(EMAIL, ENCODED_PASSWORD, NICKNAME, AuthProvider.FORYOU);
    }
}
