package xyz.abcganada.foryou.notification.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;

public interface EmitterRepository {
    // 연결 저장
    SseEmitter save(String receiverId, SseEmitter emitter);
    // 연결 조회 (누구에게 보낼지 찾기)
    Optional<SseEmitter> findById(String receiverId);
    // 전체 연결 조회 (하트비트 전송용)
    Map<String, SseEmitter> findAll();
    // emitter 인스턴스 동일성 체크
    void deleteIfSame(String receiverId, SseEmitter emitter);

    Map<String, SseEmitter> findAllByReceiverId(Long receiverId);
}
