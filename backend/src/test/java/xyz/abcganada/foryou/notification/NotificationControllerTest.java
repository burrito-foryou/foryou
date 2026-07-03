package xyz.abcganada.foryou.notification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.security.jwt.JwtTokenProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;
import xyz.abcganada.foryou.notification.repository.NotificationRepository;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.question.repository.QuestionRepository;

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
    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    private Long receiverId;
    private Long notification1Id;
    private String accessToken;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        questionRepository.deleteAll();
        memberRepository.deleteAll();

        Member receiver = memberRepository.save(
                Member.createLocalMember("receiver@test.com", null, "회원1"));
        Member sender = memberRepository.save(
                Member.createLocalMember("sender@test.com", null, "회원2"));

        Question question = questionRepository.save(
                Question.builder()
                        .member(receiver)
                        .title("테스트 질문")
                        .content("테스트 질문 내용")
                        .build()
        );

        receiverId = receiver.getId();
        accessToken = jwtTokenProvider.generateAccessToken(receiver);

        Notification notification1 = notificationRepository.save(
                Notification.create(receiver, sender, NotificationType.QUESTION_ANSWER_CREATED,
                        TargetType.ANSWER, 1L, question.getId())
                        .orElseThrow()
        );
        notification1Id = notification1.getId();

        notificationRepository.save(
                Notification.create(receiver, sender, NotificationType.QUESTION_COMMENT_CREATED,
                        TargetType.COMMENT, 2L, question.getId())
                        .orElseThrow()
        );

        notificationRepository.save(
                Notification.create(sender, receiver, NotificationType.ANSWER_COMMENT_CREATED,
                        TargetType.COMMENT, 1L, question.getId())
                        .orElseThrow()
        );

        notificationRepository.save(
                Notification.create(sender, receiver, NotificationType.ANSWER_ACCEPTED,
                        TargetType.ANSWER, 1L, question.getId())
                        .orElseThrow()
        );
    }

    @Test
    void getNotificationsTest() throws Exception {
        mockMvc.perform(get("/api/notifications")
                    .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    // 단건 읽음 처리
    @Test
    void markAsReadTest() throws Exception {
        mockMvc.perform(patch("/api/notifications/" + notification1Id + "/read")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        Notification notification = notificationRepository.findById(notification1Id)
                .orElseThrow();

        assertThat(notification.isRead()).isTrue();
    }

    // 전체 읽음 처리
    @Test
    void markAllAsReadTest() throws Exception {
        mockMvc.perform(patch("/api/notifications/read-all")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());
        List<Notification> notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
        assertThat(notifications).isNotEmpty().allMatch(Notification::isRead);
    }

    // 단건 삭제
    @Test
    void deleteNotificationsTest() throws Exception {
        mockMvc.perform(delete("/api/notifications/" + notification1Id)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        assertThat(notificationRepository.existsById(notification1Id)).isFalse();
    }

    // 전체 삭제
    @Test
    void deleteAllNotificationsTest() throws Exception {
        mockMvc.perform(delete("/api/notifications")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());
        List<Notification> notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
        assertThat(notifications).isEmpty();
    }

}