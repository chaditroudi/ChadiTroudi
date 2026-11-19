package com.codecamp.blog.domain.service;

import com.codecamp.blog.domain.exception.DuplicateSlugException;
import com.codecamp.blog.domain.model.*;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ArticleDomainServiceTest {

    private ArticleRepositoryPort repository;
    private ArticleDomainService domainService;

    @BeforeEach
    void setUp() {
        repository = mock(ArticleRepositoryPort.class);
        domainService = new ArticleDomainService(repository);
    }

    @Test
    void ensureSlugUnique_throwsWhenSlugExists() {
        Slug slug = Slug.fromTitle("Existing Article");
        when(repository.existsBySlug(slug)).thenReturn(true);

        assertThrows(DuplicateSlugException.class, () -> domainService.ensureSlugUnique(slug));
    }

    @Test
    void ensureSlugUnique_passesWhenSlugFree() {
        Slug slug = Slug.fromTitle("New Article");
        when(repository.existsBySlug(slug)).thenReturn(false);

        assertDoesNotThrow(() -> domainService.ensureSlugUnique(slug));
    }

    @Test
    void ensureSlugUniqueExcluding_allowsSameArticle() {
        Article article = Article.create("My Title", "exc", "content", "3 min", Set.of(), false);
        when(repository.findBySlug(article.getSlug())).thenReturn(Optional.of(article));

        assertDoesNotThrow(() -> domainService.ensureSlugUniqueExcluding(article.getSlug(), article));
    }

    @Test
    void ensureSlugUniqueExcluding_throwsWhenDifferentArticleHasSlug() {
        Article existing = Article.create("My Title", "exc", "content", "3 min", Set.of(), false);
        Article other = Article.create("Other", "exc2", "content2", "3 min", Set.of(), false);
        // "other" has a different slug, but simulate slug conflict:
        Slug conflictSlug = existing.getSlug();
        when(repository.findBySlug(conflictSlug)).thenReturn(Optional.of(existing));

        assertThrows(DuplicateSlugException.class,
            () -> domainService.ensureSlugUniqueExcluding(conflictSlug, other));
    }
}
