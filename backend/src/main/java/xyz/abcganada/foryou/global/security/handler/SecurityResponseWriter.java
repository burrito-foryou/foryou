package xyz.abcganada.foryou.global.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.global.response.ErrorResponse;

import java.io.IOException;

final class SecurityResponseWriter {

    private SecurityResponseWriter() {
    }

    static void write(HttpServletResponse response, ObjectMapper objectMapper, ErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(ErrorResponse.from(errorCode)));
    }
}
