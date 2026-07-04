package xyz.abcganada.foryou.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

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
}
