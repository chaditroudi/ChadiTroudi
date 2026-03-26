package com.codecamp.blog.application.service;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.mapper.ArticleApplicationMapper;
import com.codecamp.blog.domain.exception.ArticleNotFoundException;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.ArticleStatus;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.model.Tag;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ArticleQueryServiceTest {

    private ArticleRepositoryPort repository;
    private ArticleQueryService service;

    @BeforeEach
    void setUp() {
        repository = mock(ArticleRepositoryPort.class);
        service = new ArticleQueryService(repository, new ArticleApplicationMapper());
    }

    private Article publishedArticle(String title) {
        Article a = Article.create(title, "exc", "content", "3 min",
            Set.of(new Tag("Java")), false);
        a.publish();
        return a;
    }

    @Test
    void listPublished_returnsPublishedOnly() {
        Article a = publishedArticle("First");
        Article b = publishedArticle("Second");

        when(repository.findAllByStatus(ArticleStatus.PUBLISHED)).thenReturn(List.of(a, b));

        List<ArticleResponse> result = service.execute((String) null);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(r -> "published".equals(r.status())));
    }

    @Test
    void listPublished_filtersbyTag() {
        Article a = publishedArticle("Java Tips");
        when(repository.findAllByStatusAndTag(ArticleStatus.PUBLISHED, "Java"))
            .thenReturn(List.of(a));

        List<ArticleResponse> result = service.execute("Java");
        assertEquals(1, result.size());
    }

    @Test
    void getBySlug_returnsArticle() {
        Article a = publishedArticle("My Article");
        when(repository.findBySlug(new Slug("my-article"))).thenReturn(Optional.of(a));

        ArticleResponse result = service.execute("my-article");
        assertEquals("My Article", result.title());
    }

    @Test
    void getBySlug_throwsWhenNotFound() {
        when(repository.findBySlug(new Slug("nonexistent"))).thenReturn(Optional.empty());
        assertThrows(ArticleNotFoundException.class, () -> service.execute("nonexistent"));
    }

    @Test
    void getBySlug_throwsWhenNotPublished() {
        Article draft = Article.create("Draft", "exc", "content", "3 min", Set.of(), false);
        when(repository.findBySlug(new Slug("draft"))).thenReturn(Optional.of(draft));

        assertThrows(ArticleNotFoundException.class, () -> service.execute("draft"));
    }
}
