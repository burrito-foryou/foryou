package xyz.abcganada.foryou.member.service;

import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xyz.abcganada.foryou.global.security.jwt.RefreshTokenRepository;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.service.ImageService;

import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class MemberFacadeTest {

    @Mock
    private MemberService memberService;

    @Mock
    private ImageService imageService;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private MemberFacade memberFacade;

    @Test
    @DisplayName("회원 탈퇴 시 프로필 이미지와 리프레시 토큰을 정리하고 회원을 삭제한다")
    void withdraw() {
        // given
        Long memberId = MemberFixture.MEMBER_ID;

        // when
        memberFacade.withdraw(memberId);

        // then
        then(imageService).should().deleteAll(ImageTargetType.MEMBER, memberId);
        then(refreshTokenRepository).should().deleteById(memberId);
        then(memberService).should().withdraw(memberId);
    }
}
