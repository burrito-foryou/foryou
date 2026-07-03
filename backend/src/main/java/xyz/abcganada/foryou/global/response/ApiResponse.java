package xyz.abcganada.foryou.global.response;

public record ApiResponse<T>(
    boolean success,
    String message,
    T data
) {
    private static final String DEFAULT_MESSAGE = "요청이 성공했습니다.";

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, DEFAULT_MESSAGE, data);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    public static ApiResponse<Void> successWithoutData() {
        return new ApiResponse<>(true, DEFAULT_MESSAGE, null);
    }

    public static ApiResponse<Void> successWithoutData(String message) {
        return new ApiResponse<>(true, message, null);
    }
}
