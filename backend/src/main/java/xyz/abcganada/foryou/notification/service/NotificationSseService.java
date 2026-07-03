package xyz.abcganada.foryou.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xyz.abcganada.foryou.notification.repository.EmitterRepository;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationSseService {

    // SSE 연결 유지 시간 (1시간)
    private static final Long DEFAULT_TIMEOUT = 60 * 60 * 1000L;
    private final EmitterRepository emitterRepository;

    // 1. 클라이언트 SSE 연결 생성
    public SseEmitter subscribe(Long receiverId) {
        // 1) SSE 연결 객체 생성
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        // 2) 생성한 emitter Map에 저장
        emitterRepository.save(receiverId, emitter);

        // 3) 연결 종료 시 자동 삭제
        emitter.onCompletion(() -> emitterRepository.deleteById(receiverId));
        // 4) timeout 발생 시 삭제
        emitter.onTimeout(() -> emitterRepository.deleteById(receiverId));
        // 5) 에러 발생 시 삭제
        emitter.onError(e -> emitterRepository.deleteById(receiverId));

        sendToClient(receiverId, Map.of("status", "connected"));

        return emitter;

    }

    // 2. subscribe 되어 있는 클라이언트에게 이벤트 전송
    public void send(Long receiverId, Object eventPayload) {
        sendToClient(receiverId, eventPayload);
    }
    
    // 3. 실제 SSE 전송 로직
    private void sendToClient(Long receiverId, Object data) {
        // 1) 연결된 emitter 찾기
        emitterRepository.findById(receiverId)
                .ifPresent(emitter -> {
                    try {
                        // 2) 실제 HTTP 스트림으로 데이터 전송
                        emitter.send(SseEmitter.event()
                                .name("notification")
                                .data(data)
                        );
                    } catch (Exception e) {
                        // 3) 전송 실패 - 연결 제거
                        log.warn("SSE 전송 실패, emitter 제거. receiverId={}", receiverId);
                        emitterRepository.deleteById(receiverId);
                    }
                });
    }

}
