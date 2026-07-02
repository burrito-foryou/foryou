package xyz.abcganada.foryou.image.service;

import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.rest.response.ImageResponse;
import xyz.abcganada.foryou.member.service.MemberService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class ImageFacadeTest {

    @Mock
    private ImageService imageService;

    @Mock
    private MemberService memberService;

    @InjectMocks
    private ImageFacade imageFacade;

    @Test
    @DisplayName("프로필 이미지를 교체하고 회원 프로필 이미지 URL을 업데이트한다")
    void replaceMemberProfileImage() {
        // given
        Long memberId = MemberFixture.MEMBER_ID;
        MultipartFile file = mock(MultipartFile.class);
        String imageUrl = "http://localhost/images/profile.jpg";

        ImageResponse imageResponse = ImageResponse.builder()
                .id(1L)
                .targetType(ImageTargetType.MEMBER)
                .targetId(memberId)
                .imageUrl(imageUrl)
                .originalName("profile.jpg")
                .fileSize(1024L)
                .build();

        given(imageService.replace(file, ImageTargetType.MEMBER, memberId))
                .willReturn(imageResponse);

        // when
        ImageResponse result = imageFacade.replaceMemberProfileImage(memberId, file);

        // then
        assertThat(result.imageUrl()).isEqualTo(imageUrl);
        then(memberService).should().updateProfileImageUrl(memberId, imageUrl);
    }

    @Test
    @DisplayName("이미지 저장에 실패하면 회원 프로필 이미지 URL을 업데이트하지 않는다")
    void replaceMemberProfileImageWhenUploadFails() {
        // given
        Long memberId = MemberFixture.MEMBER_ID;
        MultipartFile file = mock(MultipartFile.class);

        given(imageService.replace(file, ImageTargetType.MEMBER, memberId))
                .willThrow(new BusinessException(ErrorCode.IMAGE_UPLOAD_FAILED));

        // when & then
        assertThatThrownBy(() -> imageFacade.replaceMemberProfileImage(memberId, file))
                .isInstanceOfSatisfying(BusinessException.class, exception ->
                        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.IMAGE_UPLOAD_FAILED)
                );
        then(memberService).should(never()).updateProfileImageUrl(any(), any());
    }
}
