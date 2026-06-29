package xyz.abcganada.foryou.notification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;
import xyz.abcganada.foryou.notification.repository.NotificationRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class NotificationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    MemberRepository memberRepository;

    private Long receiverId;
    private Long notification1Id;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        memberRepository.deleteAll();

        Member receiver = memberRepository.save(
                Member.createLocalMember("receiver@test.com", null, "회원1"));
        Member sender = memberRepository.save(
                Member.createLocalMember("sender@test.com", null, "회원2"));

        receiverId = receiver.getId();

        Notification notification1 = notificationRepository.save(
                Notification.builder()
                        .receiver(receiver)
                        .sender(sender)
                        .type(NotificationType.QUESTION_ANSWER_CREATED)
                        .targetType(TargetType.ANSWER)
                        .targetId(1L)
                        .questionId(1L)
                        .content("회원2님이 회원님의 질문에 답변했습니다.")
                        .build()
        );
        notification1Id = notification1.getId();

        notificationRepository.save(
                Notification.builder()
                        .receiver(receiver)
                        .sender(sender)
                        .type(NotificationType.QUESTION_COMMENT_CREATED)
                        .targetType(TargetType.COMMENT)
                        .targetId(2L)
                        .questionId(1L)
                        .content("회원2님이 회원님의 질문에 댓글을 작성했습니다.")
                        .build()
        );

        notificationRepository.save(
                Notification.builder()
                        .receiver(sender)
                        .sender(receiver)
                        .type(NotificationType.ANSWER_COMMENT_CREATED)
                        .targetType(TargetType.COMMENT)
                        .targetId(1L)
                        .questionId(1L)
                        .content("회원1님이 회원님의 답변에 댓글을 작성했습니다.")
                        .build()
        );
        notificationRepository.save(
                Notification.builder()
                        .receiver(sender)      // 회원2(답변 작성자)
                        .sender(receiver)      // 회원1(질문 작성자)
                        .type(NotificationType.ANSWER_ACCEPTED)
                        .targetType(TargetType.ANSWER)
                        .targetId(1L)          // answerId
                        .questionId(1L)
                        .content("회원1님이 회원님의 답변을 채택했습니다.")
                        .build()
        );
    }

    @Test
    void getNotificationsTest() throws Exception {
        mockMvc.perform(get("/api/notifications")
                    .param("receiverId", String.valueOf(receiverId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    // 단건 읽음 처리
    @Test
    void markAsReadTest() throws Exception {
        mockMvc.perform(patch("/api/notifications/" + notification1Id + "/read")
                        .param("receiverId", String.valueOf(receiverId)))
                .andExpect(status().isOk());

        Notification notification = notificationRepository.findById(notification1Id)
                .orElseThrow();

        assertThat(notification.isRead()).isTrue();
    }

    // 전체 읽음 처리
    @Test
    void markAllAsReadTest() throws Exception {
        mockMvc.perform(patch("/api/notifications/read-all")
                        .param("receiverId", String.valueOf(receiverId)))
                .andExpect(status().isOk());
        List<Notification> notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
        assertThat(notifications).isNotEmpty().allMatch(Notification::isRead);
    }

    // 단건 삭제
    @Test
    void deleteNotificationsTest() throws Exception {
        mockMvc.perform(delete("/api/notifications/" + notification1Id)
                        .param("receiverId", String.valueOf(receiverId)))
                .andExpect(status().isOk());

        assertThat(notificationRepository.existsById(notification1Id)).isFalse();
    }

    // 전체 삭제
    @Test
    void deleteAllNotificationsTest() throws Exception {
        mockMvc.perform(delete("/api/notifications")
                        .param("receiverId", String.valueOf(receiverId)))
                .andExpect(status().isOk());
        List<Notification> notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
        assertThat(notifications).isEmpty();
    }

}
