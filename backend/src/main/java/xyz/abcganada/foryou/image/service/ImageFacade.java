package xyz.abcganada.foryou.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.rest.response.ImageResponse;
import xyz.abcganada.foryou.member.service.MemberService;

@Component
@Transactional
@RequiredArgsConstructor
public class ImageFacade {

    private final ImageService imageService;
    private final MemberService memberService;

    public ImageResponse replaceMemberProfileImage(Long memberId, MultipartFile file) {
        ImageResponse response = imageService.replace(file, ImageTargetType.PROFILE, memberId);
        memberService.updateProfileImageUrl(memberId, response.imageUrl());

        return response;
    }
}
