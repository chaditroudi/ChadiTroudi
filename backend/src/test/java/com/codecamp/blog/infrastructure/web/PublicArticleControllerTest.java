package com.codecamp.blog.infrastructure.web;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.service.ArticleQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PublicArticleController.class)
class PublicArticleControllerTest {

    @TestConfiguration
    static class TestConfig {

        @Bean
        public ArticleQueryService articleQueryService() {
            return mock(ArticleQueryService.class);
        }

        @Bean
        public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
            http.csrf(c -> c.disable()).authorizeHttpRequests(a -> a.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArticleQueryService queryService;

    @Test
    void listPublished_returnsJson() throws Exception {
        Instant now = Instant.now();
        ArticleResponse article = new ArticleResponse(
            "1", "Test", "test", "excerpt", "content",
            "5 min read", "Mar 5, 2026", List.of("Java"), true,
            "published", now, now, now
        );
        when(queryService.execute((String) null)).thenReturn(List.of(article));

        mockMvc.perform(get("/api/v1/blog/articles"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Test"))
            .andExpect(jsonPath("$[0].slug").value("test"))
            .andExpect(jsonPath("$[0].tags[0]").value("Java"))
            .andExpect(jsonPath("$[0].featured").value(true));
    }

    @Test
    void getBySlug_returnsArticle() throws Exception {
        Instant now = Instant.now();
        ArticleResponse article = new ArticleResponse(
            "1", "My Article", "my-article", "exc", "content",
            "3 min", "Mar 5, 2026", List.of(), false,
            "published", now, now, now
        );
        when(queryService.execute("my-article")).thenReturn(article);

        mockMvc.perform(get("/api/v1/blog/articles/my-article"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.slug").value("my-article"))
            .andExpect(jsonPath("$.title").value("My Article"));
    }
}
