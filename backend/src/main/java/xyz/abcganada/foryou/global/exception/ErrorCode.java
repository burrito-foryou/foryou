package xyz.abcganada.foryou.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    //auth
    INVALID_LOGIN_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH_001", "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNSUPPORTED_OAUTH_PROVIDER(HttpStatus.BAD_REQUEST, "AUTH_002", "지원하지 않는 소셜 로그인 제공자입니다."),
    OAUTH_CLIENT_NOT_CONFIGURED(HttpStatus.INTERNAL_SERVER_ERROR, "AUTH_003", "소셜 로그인 설정이 올바르지 않습니다."),
    OAUTH_TOKEN_REQUEST_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_004", "소셜 로그인 토큰 요청에 실패했습니다."),
    OAUTH_USER_INFO_REQUEST_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_005", "소셜 사용자 정보 요청에 실패했습니다."),
    OAUTH_USER_INFO_INVALID(HttpStatus.UNAUTHORIZED, "AUTH_006", "소셜 사용자 정보가 올바르지 않습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_007", "유효하지 않은 리프레시 토큰입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH_008", "인증이 필요합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH_009", "접근 권한이 없습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_010", "토큰이 만료되었습니다."),

    //member
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "MEMBER_001", "이미 사용 중인 이메일입니다."),
    SAME_NICKNAME(HttpStatus.BAD_REQUEST, "MEMBER_002", "현재 닉네임과 동일한 닉네임입니다."),
    DUPLICATE_MEMBER(HttpStatus.CONFLICT, "MEMBER_003", "이미 가입된 회원 정보입니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER_004", "사용자를 찾을 수 없습니다."),

    //common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "COMMON_001", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON_002", "지원하지 않는 HTTP 메서드입니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON_003", "요청한 리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_004", "서버 내부 오류가 발생했습니다."),

    // like
    LIKE_ALREADY_EXISTS(HttpStatus.CONFLICT, "LIKE_001", "좋아요를 이미 누른 대상입니다."),
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "LIKE_002", "좋아요를 찾을 수 없습니다."),

    // bookmark
    BOOKMARK_ALREADY_EXISTS(HttpStatus.CONFLICT, "BOOKMARK_001", "이미 북마크한 질문입니다."),
    BOOKMARK_NOT_FOUND(HttpStatus.NOT_FOUND, "BOOKMARK_002", "북마크를 찾을 수 없습니다."),

    //answer
    ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "ANSWER_001", "답변을 찾을 수 없습니다."),
    ANSWER_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_002", "접근 권한이 없습니다."),
    ANSWER_ALREADY_ACCEPTED(HttpStatus.BAD_REQUEST, "ANSWER_003", "이미 채택된 질문입니다."),

    // question
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "QUESTION_001", "질문을 찾을 수 없습니다."),
    QUESTION_FORBIDDEN(HttpStatus.FORBIDDEN, "QUESTION_002", "질문 작성자만 수정/삭제할 수 있습니다."),

    // comment
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT_001", "댓글을 찾을 수 없습니다."),
    COMMENT_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT_002", "접근 권한이 없습니다."),

    // notification
    NOTIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "NOTIFICATION_001", "알림을 찾을 수 없습니다."),

    // image
    IMAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "IMAGE_001", "이미지를 찾을 수 없습니다."),
    INVALID_IMAGE_EXTENSION(HttpStatus.BAD_REQUEST, "IMAGE_002", "지원하지 않는 이미지 형식입니다."),
    IMAGE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "IMAGE_003", "이미지 크기는 5MB를 초과할 수 없습니다."),
    IMAGE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "IMAGE_004", "이미지 업로드에 실패했습니다."),
    IMAGE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "IMAGE_005", "이미지 삭제에 실패했습니다.");





    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
