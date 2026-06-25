package xyz.abcganada.foryou.global.exception;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import xyz.abcganada.foryou.global.response.ErrorResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity
            .status(errorCode.getHttpStatus())
            .body(ErrorResponse.from(errorCode));
    }

    @ExceptionHandler({
        MethodArgumentNotValidException.class,
        ConstraintViolationException.class,
        MethodArgumentTypeMismatchException.class,
        HttpMessageNotReadableException.class
    })
    public ResponseEntity<ErrorResponse> handleInvalidInput(Exception e) {
        return ResponseEntity
            .status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus())
            .body(ErrorResponse.from(ErrorCode.INVALID_INPUT_VALUE));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotAllowed(Exception e) {
        return ResponseEntity
            .status(ErrorCode.METHOD_NOT_ALLOWED.getHttpStatus())
            .body(ErrorResponse.from(ErrorCode.METHOD_NOT_ALLOWED));
    }
}
