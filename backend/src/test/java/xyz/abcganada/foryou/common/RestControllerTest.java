package xyz.abcganada.foryou.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.MultiValueMap;
import xyz.abcganada.foryou.global.security.jwt.JwtTokenProvider;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@AutoConfigureMockMvc(addFilters = false)
public abstract class RestControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @MockBean
    protected JwtTokenProvider jwtTokenProvider;

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
