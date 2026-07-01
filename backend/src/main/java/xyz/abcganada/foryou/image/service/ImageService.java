package xyz.abcganada.foryou.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.image.domain.Image;
import xyz.abcganada.foryou.image.domain.ImageTargetType;
import xyz.abcganada.foryou.image.repository.ImageRepository;
import xyz.abcganada.foryou.image.rest.response.ImageResponse;
import xyz.abcganada.foryou.image.storage.ImageStorage;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final ImageStorage imageStorage;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

    @Transactional
    public ImageResponse replace(MultipartFile file, ImageTargetType targetType, Long targetId) {
        deleteAll(targetType, targetId);
        return upload(file, targetType, targetId);
    }

    @Transactional
    public ImageResponse upload(MultipartFile file, ImageTargetType targetType, Long targetId) {
        validate(file);

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getExtension(originalName);
        String storedName = UUID.randomUUID() + "." + extension;

        String imageUrl = imageStorage.store(file, storedName);

        Image image = Image.builder()
                .targetType(targetType)
                .targetId(targetId)
                .imageUrl(imageUrl)
                .originalName(originalName)
                .storedName(storedName)
                .fileSize(file.getSize())
                .build();

        return ImageResponse.from(imageRepository.save(image));
    }

    public List<ImageResponse> findAll(ImageTargetType targetType, Long targetId) {
        return imageRepository.findByTargetTypeAndTargetId(targetType, targetId)
                .stream()
                .map(ImageResponse::from)
                .toList();
    }

    @Transactional
    public void delete(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new BusinessException(ErrorCode.IMAGE_NOT_FOUND));

        imageStorage.delete(image.getStoredName());
        imageRepository.delete(image);
    }

    @Transactional
    public void deleteAll(ImageTargetType targetType, Long targetId) {
        List<Image> images = imageRepository.findByTargetTypeAndTargetId(targetType, targetId);
        images.forEach(image -> imageStorage.delete(image.getStoredName()));
        imageRepository.deleteByTargetTypeAndTargetId(targetType, targetId);
    }

    private void validate(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.IMAGE_SIZE_EXCEEDED);
        }
        String extension = getExtension(StringUtils.cleanPath(file.getOriginalFilename()));
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BusinessException(ErrorCode.INVALID_IMAGE_EXTENSION);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new BusinessException(ErrorCode.INVALID_IMAGE_EXTENSION);
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}