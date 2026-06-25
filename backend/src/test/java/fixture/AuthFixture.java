package fixture;

import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;

public class AuthFixture {

    public static final String EMAIL = "test@example.com";
    public static final String PASSWORD = "password123";
    public static final String NICKNAME = "tester";

    public static SignupRequest signupRequest() {
        return new SignupRequest(EMAIL, PASSWORD, NICKNAME);
    }

    public static SignupRequest signupRequest(String email, String password, String nickname) {
        return new SignupRequest(email, password, nickname);
    }

    public static SignupRequest invalidSignupRequest() {
        return new SignupRequest("invalid-email", "short", "");
    }

    public static SignupResponse signupResponse() {
        return new SignupResponse(MemberFixture.MEMBER_ID, EMAIL, NICKNAME);
    }
}
