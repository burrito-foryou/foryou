package xyz.abcganada.foryou.notification.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.notification.rest.response.NotificationResponse;
import xyz.abcganada.foryou.notification.service.NotificationService;
import xyz.abcganada.foryou.notification.service.NotificationSseService;

import java.util.List;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationSseService notificationSseService;

    // TODO : 인증 구현 후 @RequestParam Long receiverId 교체
    // 1. 내 알림 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@RequestParam Long receiverId) {

        List<NotificationResponse> notifications = notificationService.getNotifications(receiverId)
                .stream()
                .map(NotificationResponse::from)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    // 2. 단건 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long notificationId,
                                                        @RequestParam Long receiverId) {
        notificationService.markAsRead(notificationId, receiverId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림을 읽음 처리했습니다."));
    }

    // 3. 전체 읽음 처리
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@RequestParam Long receiverId) {
        notificationService.markAllAsRead(receiverId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림을 읽음 처리했습니다."));
    }

    // 4. 알림 단건 삭제
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long notificationId,
                                                                @RequestParam Long receiverId) {
        notificationService.deleteNotification(notificationId, receiverId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림이 삭제되었습니다."));
    }

    // 5. 알림 전체 삭제
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(@RequestParam Long receiverId) {
        notificationService.deleteAllNotifications(receiverId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림이 삭제되었습니다."));
    }

    // SSE 구독
    @GetMapping(value = "/subscribe/{receiverId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long receiverId) {
        return notificationSseService.subscribe(receiverId);
    }


}
