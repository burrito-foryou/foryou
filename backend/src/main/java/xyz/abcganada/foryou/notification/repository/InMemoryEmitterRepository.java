package xyz.abcganada.foryou.notification.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryEmitterRepository implements EmitterRepository {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    // 연결 저장
    @Override
    public SseEmitter save(Long receiverId, SseEmitter emitter) {
        emitters.put(receiverId, emitter);
        return emitter;
    }

    // 연결 조회
    @Override
    public Optional<SseEmitter> findById(Long receiverId) {
        return Optional.ofNullable(emitters.get(receiverId));
    }

    // 연결 제거
    @Override
    public void deleteById(Long receiverId) {
        emitters.remove(receiverId);
    }
}
