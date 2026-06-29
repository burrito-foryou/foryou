package xyz.abcganada.foryou.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.MultiValueMap;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import xyz.abcganada.foryou.global.exception.GlobalExceptionHandler;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

public abstract class RestControllerTest {

    protected MockMvc mockMvc;
    protected ObjectMapper objectMapper = new ObjectMapper();

    protected void setupController(Object controller) {
        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(new GlobalExceptionHandler())
            .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
            .build();
    }

    protected ResultActions getRequest(String url, Object... uriVariables) throws Exception {
        return mockMvc.perform(get(url, uriVariables)
            .accept(MediaType.APPLICATION_JSON));
    }

    protected ResultActions getRequest(
        String url,
        MultiValueMap<String, String> params,
        Object... uriVariables
    ) throws Exception {
        return mockMvc.perform(get(url, uriVariables)
            .params(params)
            .accept(MediaType.APPLICATION_JSON));
    }

    protected ResultActions postRequest(String url, Object body, Object... uriVariables) throws Exception {
        return mockMvc.perform(post(url, uriVariables)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions putRequest(String url, Object body, Object... uriVariables) throws Exception {
        return mockMvc.perform(put(url, uriVariables)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions patchRequest(String url, Object... uriVariables) throws Exception {
        return mockMvc.perform(patch(url, uriVariables)
            .contentType(MediaType.APPLICATION_JSON));
    }

    protected ResultActions patchRequestWithBody(String url, Object body, Object... uriVariables) throws Exception {
        return mockMvc.perform(patch(url, uriVariables)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions deleteRequest(String url, Object... uriVariables) throws Exception {
        return mockMvc.perform(delete(url, uriVariables));
    }
}
