package com.codecamp.blog.application.mapper;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.Tag;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Application mapper — Domain model → Response DTO.
 */
public class ArticleApplicationMapper {

    private static final DateTimeFormatter DATE_FMT =
        DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH)
            .withZone(ZoneId.of("UTC"));

    public ArticleResponse toResponse(Article article) {
        String formattedDate = article.getPublishedAt() != null
            ? DATE_FMT.format(article.getPublishedAt())
            : DATE_FMT.format(article.getCreatedAt());

        return new ArticleResponse(
            article.getId().value().toString(),
            article.getTitle(),
            article.getSlug().value(),
            article.getExcerpt(),
            article.getContent(),
            article.getReadTime(),
            formattedDate,
            article.getTags().stream().map(Tag::value).toList(),
            article.isFeatured(),
            article.getStatus().name().toLowerCase(),
            article.getCreatedAt(),
            article.getUpdatedAt(),
            article.getPublishedAt()
        );
    }
}
