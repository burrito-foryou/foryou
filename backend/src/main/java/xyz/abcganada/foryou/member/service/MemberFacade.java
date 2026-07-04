package xyz.abcganada.foryou.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.security.jwt.RefreshTokenRepository;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.service.ImageService;

@Slf4j
@Component
@Transactional
@RequiredArgsConstructor
public class MemberFacade {

    private final MemberService memberService;
    private final ImageService imageService;
    private final RefreshTokenRepository refreshTokenRepository;

    public void withdraw(Long memberId) {
        log.info("[Member] 회원 탈퇴 오케스트레이션 시작 - memberId: {}", memberId);

        imageService.deleteAll(ImageTargetType.MEMBER, memberId);
        refreshTokenRepository.deleteById(memberId);
        memberService.withdraw(memberId);

        log.info("[Member] 회원 탈퇴 오케스트레이션 완료 - memberId: {}", memberId);
    }
}
