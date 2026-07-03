package xyz.abcganada.foryou.global.response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.global.exception.ErrorCode;

import static org.assertj.core.api.Assertions.assertThat;

class ErrorResponseTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("ErrorCode로 실패 응답을 생성한다")
    void createErrorResponse() {
        ErrorResponse response = ErrorResponse.from(ErrorCode.INVALID_INPUT_VALUE);

        assertThat(response.success()).isFalse();
        assertThat(response.code()).isEqualTo("COMMON_001");
        assertThat(response.message()).isEqualTo("잘못된 입력값입니다.");
    }

    @Test
    @DisplayName("실패 응답을 JSON으로 직렬화한다")
    void serializeErrorResponse() {
        ErrorResponse response = ErrorResponse.from(ErrorCode.INVALID_INPUT_VALUE);

        JsonNode json = objectMapper.valueToTree(response);

        assertThat(json.get("success").asBoolean()).isFalse();
        assertThat(json.get("code").asText()).isEqualTo("COMMON_001");
        assertThat(json.get("message").asText())
                .isEqualTo("잘못된 입력값입니다.");
    }
}
