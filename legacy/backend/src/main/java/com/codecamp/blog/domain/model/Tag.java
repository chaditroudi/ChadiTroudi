package com.codecamp.blog.domain.model;

import java.util.Objects;

/**
 * Value object — article tag.
 */
public record Tag(String value) {

    public Tag {
        Objects.requireNonNull(value, "Tag must not be null");
        value = value.trim();
        if (value.isEmpty() || value.length() > 50) {
            throw new IllegalArgumentException("Tag must be 1-50 characters, got: " + value.length());
        }
    }
}
