package xyz.abcganada.foryou.image.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class LocalImageStorage implements ImageStorage {

    @Value("${image.upload.path}")
    private String uploadPath;

    @Value("${image.upload.url-prefix}")
    private String urlPrefix;

    @Override
    public String store(MultipartFile file, String storedName) {
        Path filePath = Paths.get(uploadPath, storedName);
        try {
            Files.createDirectories(filePath.getParent());
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
        return urlPrefix + "/" + storedName;
    }

    @Override
    public void delete(String storedName) {
        Path filePath = Paths.get(uploadPath, storedName);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }
}