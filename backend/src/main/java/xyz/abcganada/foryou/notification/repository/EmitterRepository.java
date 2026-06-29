package xyz.abcganada.foryou.notification.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Optional;

public interface EmitterRepository {
    // 연결 저장
    SseEmitter save(Long receiverId, SseEmitter emitter);
    // 연결 조회 (누구에게 보낼지 찾기)
    Optional<SseEmitter> findById(Long receiverId);
    // 연결 제거
    void deleteById(Long receiverId);
}
