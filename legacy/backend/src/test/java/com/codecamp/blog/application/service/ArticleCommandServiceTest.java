package com.codecamp.blog.application.service;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.dto.CreateArticleCommand;
import com.codecamp.blog.application.mapper.ArticleApplicationMapper;
import com.codecamp.blog.domain.exception.DuplicateSlugException;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;
import com.codecamp.blog.domain.service.ArticleDomainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ArticleCommandServiceTest {

    private ArticleRepositoryPort repository;
    private ArticleDomainService domainService;
    private ArticleApplicationMapper mapper;
    private ArticleCommandService service;

    @BeforeEach
    void setUp() {
        repository = mock(ArticleRepositoryPort.class);
        domainService = mock(ArticleDomainService.class);
        mapper = new ArticleApplicationMapper();
        service = new ArticleCommandService(repository, domainService, mapper);
    }

    @Test
    void createArticle_returnsResponse() {
        CreateArticleCommand cmd = new CreateArticleCommand(
            "Test Article", "excerpt", "content body",
            "5 min read", Set.of("Java", "TDD"), true
        );

        when(repository.save(any(Article.class))).thenAnswer(inv -> inv.getArgument(0));

        ArticleResponse response = service.execute(cmd);

        assertNotNull(response.id());
        assertEquals("Test Article", response.title());
        assertEquals("test-article", response.slug());
        assertEquals("excerpt", response.excerpt());
        assertEquals("draft", response.status());
        assertTrue(response.featured());
        assertEquals(2, response.tags().size());

        verify(domainService).ensureSlugUnique(any(Slug.class));
        verify(repository).save(any(Article.class));
    }

    @Test
    void createArticle_throwsOnDuplicateSlug() {
        CreateArticleCommand cmd = new CreateArticleCommand(
            "Duplicate", "exc", "content", "3 min", Set.of(), false
        );
        doThrow(new DuplicateSlugException(Slug.fromTitle("Duplicate")))
            .when(domainService).ensureSlugUnique(any(Slug.class));

        assertThrows(DuplicateSlugException.class, () -> service.execute(cmd));
        verify(repository, never()).save(any());
    }
}
