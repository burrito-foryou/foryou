package xyz.abcganada.foryou.notification.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Notification", description = "알림 관련 API")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationSseService notificationSseService;

    // 1. 내 알림 목록 조회
    @Operation(summary = "내 알림 목록 조회", description = "로그인한 회원의 알림 목록을 최신순으로 조회한다.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@AuthenticationPrincipal AuthMember member) {

        List<NotificationResponse> notifications = notificationService.getNotifications(member.memberId())
                .stream()
                .map(NotificationResponse::from)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    // 2. 단건 읽음 처리
    @Operation(summary = "알림 단건 읽음 처리", description = "알림 하나를 읽음 상태로 변경한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long notificationId,
                                                        @AuthenticationPrincipal AuthMember member) {
        notificationService.markAsRead(notificationId, member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림을 읽음 처리했습니다."));
    }

    // 3. 전체 읽음 처리
    @Operation(summary = "알림 전체 읽음 처리", description = "로그인한 회원의 모든 알림을 읽음 상태로 변경한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal AuthMember member) {
        notificationService.markAllAsRead(member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림을 읽음 처리했습니다."));
    }

    // 4. 알림 단건 삭제
    @Operation(summary = "알림 단건 삭제", description = "알림 하나를 삭제한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long notificationId,
                                                                @AuthenticationPrincipal AuthMember member) {
        notificationService.deleteNotification(notificationId, member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("알림이 삭제되었습니다."));
    }

    // 5. 알림 전체 삭제
    @Operation(summary = "알림 전체 삭제", description = "로그인한 회원의 모든 알림을 삭제한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(@AuthenticationPrincipal AuthMember member) {
        notificationService.deleteAllNotifications(member.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("모든 알림이 삭제되었습니다."));
    }

    // SSE 구독
    @Operation(
        summary = "알림 실시간 구독(SSE)",
        description = "Server-Sent Events로 알림을 실시간 구독한다. 연결 직후 {\"status\":\"connected\"} 이벤트가 한 번 오고, "
            + "이후 새 알림이 생길 때마다 'notification' 이름의 이벤트로 아래 데이터가 전송된다. "
            + "Swagger UI의 'Try it out'은 스트림 응답이라 정상적으로 종료되지 않으니, 실제 확인은 curl -N 이나 프론트 EventSource로 하는 걸 권장한다."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "SSE 스트림 연결 성공",
        content = @Content(mediaType = MediaType.TEXT_EVENT_STREAM_VALUE, schema = @Schema(implementation = NotificationResponse.class))
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal AuthMember member) {
        return notificationSseService.subscribe(member.memberId());
    }

}
