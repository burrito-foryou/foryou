package xyz.abcganada.foryou.image.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;

import java.io.IOException;
import java.util.Map;

@Component
@Primary
@RequiredArgsConstructor
public class CloudinaryImageStorage implements ImageStorage {

    private final Cloudinary cloudinary;

    @Override
    public String store(MultipartFile file, String storedName) {
        try {
            Map result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("public_id", "foryou/" + storedName)
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    @Override
    public void delete(String storedName) {
        try {
            cloudinary.uploader().destroy(
                "foryou/" + storedName,
                ObjectUtils.emptyMap()
            );
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }
}
