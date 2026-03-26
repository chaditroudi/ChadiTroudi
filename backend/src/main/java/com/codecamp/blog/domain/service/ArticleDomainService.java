package com.codecamp.blog.domain.service;

import com.codecamp.blog.domain.exception.DuplicateSlugException;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;

/**
 * Domain service — encapsulates cross-entity business rules.
 */
public class ArticleDomainService {

    private final ArticleRepositoryPort repository;

    public ArticleDomainService(ArticleRepositoryPort repository) {
        this.repository = repository;
    }

    public void ensureSlugUnique(Slug slug) {
        if (repository.existsBySlug(slug)) {
            throw new DuplicateSlugException(slug);
        }
    }

    public void ensureSlugUniqueExcluding(Slug slug, Article existing) {
        repository.findBySlug(slug).ifPresent(found -> {
            if (!found.getId().equals(existing.getId())) {
                throw new DuplicateSlugException(slug);
            }
        });
    }
}
