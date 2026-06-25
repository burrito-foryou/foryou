package xyz.abcganada.foryou.global.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    private record TestRequest(
        @NotBlank String name
    ) {
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new TestController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("비즈니스 예외를 ErrorCode에 맞는 응답으로 변환한다")
    void handleBusinessException() throws Exception {
        mockMvc.perform(get("/test/business"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("COMMON_003"))
                .andExpect(jsonPath("$.message")
                        .value("요청한 리소스를 찾을 수 없습니다."));
    }

    @Test
    @DisplayName("요청 본문 검증 실패를 잘못된 입력값 응답으로 변환한다")
    void handleMethodArgumentNotValidException() throws Exception {
        mockMvc.perform(post("/test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("COMMON_001"))
                .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));
    }

    @Test
    @DisplayName("읽을 수 없는 JSON을 잘못된 입력값 응답으로 변환한다")
    void handleHttpMessageNotReadableException() throws Exception {
        mockMvc.perform(post("/test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("COMMON_001"))
                .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));
    }

    @Test
    @DisplayName("경로 변수 타입 불일치를 잘못된 입력값 응답으로 변환한다")
    void handleMethodArgumentTypeMismatchException() throws Exception {
        mockMvc.perform(get("/test/type/not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("COMMON_001"))
                .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));
    }

    @Test
    @DisplayName("지원하지 않는 HTTP 메서드를 Method Not Allowed 응답으로 변환한다")
    void handleMethodNotAllowedException() throws Exception {
        mockMvc.perform(post("/test/business"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("COMMON_002"))
                .andExpect(jsonPath("$.message")
                        .value("지원하지 않는 HTTP 메서드입니다."));
    }

    @RestController
    @RequestMapping("/test")
    static class TestController {

        @GetMapping("/business")
        void businessException() {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        @PostMapping("/validation")
        void validateRequest(@Valid @RequestBody TestRequest request) {
        }

        @GetMapping("/type/{id}")
        void typeMismatch(@PathVariable("id") Long id) {
        }

    }
}
