package xyz.abcganada.foryou.image.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.rest.response.ImageResponse;
import xyz.abcganada.foryou.member.service.MemberService;

@Slf4j
@Component
@Transactional
@RequiredArgsConstructor
public class ImageFacade {

    private final ImageService imageService;
    private final MemberService memberService;

    public ImageResponse replaceMemberProfileImage(Long memberId, MultipartFile file) {
        log.info("[Image] 프로필 이미지 교체 - memberId: {}", memberId);
        ImageResponse response = imageService.replace(file, ImageTargetType.MEMBER, memberId);
        memberService.updateProfileImageUrl(memberId, response.imageUrl());
        
        log.info("[Image] 프로필 이미지 교체 완료 - memberId: {}, imageUrl: {}", memberId, response.imageUrl());

        return response;
    }
}
