package xyz.abcganada.foryou.notification.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryEmitterRepository implements EmitterRepository {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    // 연결 저장
    @Override
    public SseEmitter save(String key, SseEmitter emitter) {
        emitters.put(key, emitter);
        return emitter;
    }

    // 연결 조회
    @Override
    public Optional<SseEmitter> findById(String key) {
        return Optional.ofNullable(emitters.get(key));
    }

    // 전체 연결 조회
    @Override
    public Map<String, SseEmitter> findAll() {
        return emitters;
    }

    @Override
    public Map<String, SseEmitter> findAllByReceiverId(Long receiverId) {
        Map<String, SseEmitter> result = new ConcurrentHashMap<>();

        for (String key : emitters.keySet()) { // key 하나씩 꺼내기
            String[] parts = key.split(":"); // "1:uuid-A" -> ["1","uuid-A"]
            String ownerId = parts[0]; // "1"

            if (ownerId.equals(receiverId.toString())) {
                result.put(key, emitters.get(key));
            }
        }
        return result;
    }

    @Override
    public void deleteIfSame(String key, SseEmitter emitter) {
        emitters.remove(key, emitter); // onCompletion의 Emitter와 Map에 등록된 옛 Emitter와 동일할 때만 제거
    }

}
