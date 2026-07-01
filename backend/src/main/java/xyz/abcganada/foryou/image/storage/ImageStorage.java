package xyz.abcganada.foryou.image.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorage {
    String store(MultipartFile file, String storedName);
    void delete(String storedName);
}