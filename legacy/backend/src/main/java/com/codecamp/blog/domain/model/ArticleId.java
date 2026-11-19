package com.codecamp.blog.domain.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object — Article identity.
 */
public record ArticleId(UUID value) {

    public ArticleId {
        Objects.requireNonNull(value, "ArticleId must not be null");
    }

    public static ArticleId generate() {
        return new ArticleId(UUID.randomUUID());
    }

    public static ArticleId of(UUID value) {
        return new ArticleId(value);
    }

    public static ArticleId of(String value) {
        return new ArticleId(UUID.fromString(value));
    }
}
