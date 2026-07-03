package xyz.abcganada.foryou.notification.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
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

    // 1. 내 알림 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@AuthenticationPrincipal AuthMember member) {

        List<NotificationResponse> notifications = notificationService.getNotifications(member.memberId())
                .stream()
                .map(NotificationResponse::from)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    // 2. 단건 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long notificationId,
                                                        @AuthenticationPrincipal AuthMember member) {
        notificationService.markAsRead(notificationId, member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림을 읽음 처리했습니다."));
    }

    // 3. 전체 읽음 처리
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal AuthMember member) {
        notificationService.markAllAsRead(member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림을 읽음 처리했습니다."));
    }

    // 4. 알림 단건 삭제
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long notificationId,
                                                                @AuthenticationPrincipal AuthMember member) {
        notificationService.deleteNotification(notificationId, member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림이 삭제되었습니다."));
    }

    // 5. 알림 전체 삭제
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(@AuthenticationPrincipal AuthMember member) {
        notificationService.deleteAllNotifications(member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림이 삭제되었습니다."));
    }

    // SSE 구독
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal AuthMember member) {
        return notificationSseService.subscribe(member.memberId());
    }


}
