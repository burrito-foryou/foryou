package xyz.abcganada.foryou.image.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.rest.response.ImageResponse;
import xyz.abcganada.foryou.image.service.ImageFacade;
import xyz.abcganada.foryou.image.service.ImageService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageController {

    private final ImageFacade imageFacade;
    private final ImageService imageService;

    // 질문 이미지 업로드
    @PostMapping(value = "/questions/{questionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageResponse>> uploadQuestionImage(
            @PathVariable Long questionId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AuthMember authMember) {
        ImageResponse response = imageService.upload(file, ImageTargetType.QUESTION, questionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 답변 이미지 업로드
    @PostMapping(value = "/answers/{answerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageResponse>> uploadAnswerImage(
            @PathVariable Long answerId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AuthMember authMember) {
        ImageResponse response = imageService.upload(file, ImageTargetType.ANSWER, answerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 프로필 이미지 업로드 (기존 이미지 교체)
    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageResponse>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AuthMember authMember) {
        ImageResponse response = imageFacade.replaceMemberProfileImage(authMember.memberId(), file);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 이미지 조회
    @GetMapping("/{targetType}/{targetId}")
    public ResponseEntity<ApiResponse<List<ImageResponse>>> getImages(
            @PathVariable ImageTargetType targetType,
            @PathVariable Long targetId) {
        List<ImageResponse> response = imageService.findAll(targetType, targetId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 이미지 단건 삭제
    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long imageId,
            @AuthenticationPrincipal AuthMember authMember) {
        imageService.delete(imageId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}