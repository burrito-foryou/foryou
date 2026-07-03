package xyz.abcganada.foryou.global.response;

import xyz.abcganada.foryou.global.exception.ErrorCode;

public record ErrorResponse(
    boolean success,
    String code,
    String message
) {
    public static ErrorResponse from(ErrorCode errorCode) {
        return new ErrorResponse(false, errorCode.getCode(), errorCode.getMessage());
    }
}
