package xyz.abcganada.foryou.image.rest.response;

import lombok.Builder;
import xyz.abcganada.foryou.image.domain.Image;
import xyz.abcganada.foryou.image.domain.ImageTargetType;

@Builder
public record ImageResponse(
        Long id,
        ImageTargetType targetType,
        Long targetId,
        String imageUrl,
        String originalName,
        Long fileSize
) {
    public static ImageResponse from(Image image) {
        return ImageResponse.builder()
                .id(image.getId())
                .targetType(image.getTargetType())
                .targetId(image.getTargetId())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .fileSize(image.getFileSize())
                .build();
    }
}