package org.ticketApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class corsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to ALL endpoints
                        .allowedOrigins("http://localhost:4200",
                                		"https://melodious-alignment-production.up.railway.app",
                                		"https://train-ticket-cr.up.railway.app") // Allow this specific frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow these actions
                        .allowedHeaders("*"); // Allow all headers
            }
        };
    }
}
