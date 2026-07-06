package xyz.abcganada.foryou.global.config;

import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import xyz.abcganada.foryou.global.response.ErrorResponse;

@Configuration
public class SwaggerConfig {

    private static final String ERROR_RESPONSE_SCHEMA_NAME = "ErrorResponse";

    @Bean
    public OpenAPI openAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT");

        Info info = new Info()
            .title("ForYou API")
            .description("ForYou 서비스 API 명세")
            .version("v1");

        return new OpenAPI()
            .info(info)
            .components(new Components().addSecuritySchemes("bearerAuth", securityScheme));
    }

    @Bean
    public OpenApiCustomizer unauthorizedResponseCustomizer() {
        return openApi -> {
            registerErrorResponseSchema(openApi);

            openApi.getPaths().values().forEach(pathItem ->
                pathItem.readOperations().stream()
                    .filter(operation -> operation.getSecurity() != null && !operation.getSecurity().isEmpty())
                    .forEach(operation -> operation.getResponses().addApiResponse("401", unauthorizedApiResponse()))
            );
        };
    }

    private void registerErrorResponseSchema(OpenAPI openApi) {
        if (openApi.getComponents().getSchemas() != null
            && openApi.getComponents().getSchemas().containsKey(ERROR_RESPONSE_SCHEMA_NAME)) {
            return;
        }

        ResolvedSchema resolvedSchema = ModelConverters.getInstance()
            .resolveAsResolvedSchema(new AnnotatedType(ErrorResponse.class));
        openApi.getComponents().addSchemas(ERROR_RESPONSE_SCHEMA_NAME, resolvedSchema.schema);
    }

    private ApiResponse unauthorizedApiResponse() {
        return new ApiResponse()
            .description("인증 실패 (토큰이 없거나 유효하지 않음)")
            .content(new Content().addMediaType(
                "application/json",
                new MediaType().schema(new Schema<>().$ref("#/components/schemas/" + ERROR_RESPONSE_SCHEMA_NAME))
            ));
    }
}
