package xyz.abcganada.foryou.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xyz.abcganada.foryou.notification.repository.EmitterRepository;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class SseHearbeatScheduler {

    private final EmitterRepository emitterRepository;

    // 프록시/브라우저의 idle 타임아웃으로 연결이 끊기는 것 방지 (ERR_INCOMPLETE_CHUNKED_ENCODING)
    @Scheduled(fixedRate = 20_000)
    public void sendHeartbeat() {
        emitterRepository.findAll().forEach((receiverId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().comment("heartbeat"));
            } catch (IOException e) {
                log.warn("SSE 하트비트 전송 실패, emitter 제거. receiverId={}", receiverId);
                emitter.completeWithError(e); // onError 콜백이 deleteIfSame으로 제거
            }
        });
    }

}
