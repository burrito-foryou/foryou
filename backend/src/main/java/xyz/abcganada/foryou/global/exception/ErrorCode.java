package xyz.abcganada.foryou.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    //auth
    INVALID_LOGIN_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH_001", "이메일 또는 비밀번호가 올바르지 않습니다."),

    //member
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "MEMBER_001", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "MEMBER_002", "이미 사용 중인 닉네임입니다."),
    DUPLICATE_MEMBER(HttpStatus.CONFLICT, "MEMBER_003", "이미 가입된 회원 정보입니다."),

    //common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "COMMON_001", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON_002", "지원하지 않는 HTTP 메서드입니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON_003", "요청한 리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_004", "서버 내부 오류가 발생했습니다."),

    //answer
    ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "ANSWER_001", "답변을 찾을 수 없습니다."),
    ANSWER_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_002", "답변 작성자만 수정/삭제할 수 있습니다."),
    ANSWER_ALREADY_ACCEPTED(HttpStatus.BAD_REQUEST, "ANSWER_003", "이미 채택된 질문입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
