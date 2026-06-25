package xyz.abcganada.foryou.global.response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ApiResponseTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private record TestData(Long id, String name) {
    }

    @Test
    @DisplayName("데이터를 포함한 성공 응답을 생성한다")
    void createSuccessResponseWithData() {
        TestData data = new TestData(1L, "테스트");

        ApiResponse<TestData> response = ApiResponse.success(data);

        assertThat(response.success()).isTrue();
        assertThat(response.message()).isEqualTo("요청이 성공했습니다.");
        assertThat(response.data()).isEqualTo(data);
    }

    @Test
    @DisplayName("사용자 정의 메시지로 성공 응답을 생성한다")
    void createSuccessResponseWithCustomMessage() {
        TestData data = new TestData(1L, "테스트");

        ApiResponse<TestData> response = ApiResponse.success(data, "조회에 성공했습니다.");

        assertThat(response.success()).isTrue();
        assertThat(response.message()).isEqualTo("조회에 성공했습니다.");
        assertThat(response.data()).isEqualTo(data);
    }

    @Test
    @DisplayName("데이터가 없는 성공 응답을 생성한다")
    void createSuccessResponseWithoutData() {
        ApiResponse<Void> response = ApiResponse.successWithoutData("삭제에 성공했습니다.");

        assertThat(response.success()).isTrue();
        assertThat(response.message()).isEqualTo("삭제에 성공했습니다.");
        assertThat(response.data()).isNull();
    }

    @Test
    @DisplayName("성공 응답을 JSON으로 직렬화한다")
    void serializeSuccessResponse() {
        ApiResponse<TestData> response = ApiResponse.success(new TestData(1L, "테스트"));

        JsonNode json = objectMapper.valueToTree(response);

        assertThat(json.get("success").asBoolean()).isTrue();
        assertThat(json.get("message").asText())
                .isEqualTo("요청이 성공했습니다.");
        assertThat(json.get("data").get("id").asLong()).isEqualTo(1L);
        assertThat(json.get("data").get("name").asText()).isEqualTo("테스트");
    }
}
