package com.codecamp.blog.infrastructure.persistence;

import com.codecamp.blog.domain.model.*;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Persistence mapper — Domain ↔ JPA entity.
 * Bidirectional: toDomain() and toJpa().
 */
public class ArticlePersistenceMapper {

    public Article toDomain(ArticleJpaEntity entity) {
        Set<Tag> tags = parseTags(entity.getTags());
        ArticleStatus status = ArticleStatus.valueOf(entity.getStatus().name());

        return Article.reconstitute(
            ArticleId.of(entity.getId()),
            entity.getTitle(),
            new Slug(entity.getSlug()),
            entity.getExcerpt(),
            entity.getContent(),
            entity.getReadTime(),
            tags,
            entity.isFeatured(),
            status,
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getPublishedAt()
        );
    }

    public ArticleJpaEntity toJpa(Article article) {
        ArticleJpaEntity entity = new ArticleJpaEntity();
        entity.setId(article.getId().value());
        entity.setTitle(article.getTitle());
        entity.setSlug(article.getSlug().value());
        entity.setExcerpt(article.getExcerpt());
        entity.setContent(article.getContent());
        entity.setReadTime(article.getReadTime());
        entity.setTags(serializeTags(article.getTags()));
        entity.setFeatured(article.isFeatured());
        entity.setStatus(ArticleJpaEntity.ArticleStatusJpa.valueOf(article.getStatus().name()));
        entity.setCreatedAt(article.getCreatedAt());
        entity.setUpdatedAt(article.getUpdatedAt());
        entity.setPublishedAt(article.getPublishedAt());
        return entity;
    }

    private Set<Tag> parseTags(String raw) {
        if (raw == null || raw.isBlank()) return new LinkedHashSet<>();
        return Arrays.stream(raw.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Tag::new)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String serializeTags(Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) return "";
        return tags.stream().map(Tag::value).collect(Collectors.joining(","));
    }
}
