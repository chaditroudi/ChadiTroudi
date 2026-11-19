package com.codecamp.blog.domain.model;

import java.text.Normalizer;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value object — URL-friendly slug derived from a title.
 */
public record Slug(String value) {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9\\s-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-{2,}");

    public Slug {
        Objects.requireNonNull(value, "Slug must not be null");
        if (value.isBlank()) {
            throw new IllegalArgumentException("Slug must not be blank");
        }
    }

    public static Slug fromTitle(String title) {
        Objects.requireNonNull(title, "Title must not be null");
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        String slug = normalized.toLowerCase().trim();
        slug = NON_ALPHANUMERIC.matcher(slug).replaceAll("");
        slug = WHITESPACE.matcher(slug).replaceAll("-");
        slug = MULTIPLE_HYPHENS.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-|-$", "");

        if (slug.isEmpty()) {
            throw new IllegalArgumentException("Cannot create slug from title: " + title);
        }
        return new Slug(slug);
    }
}
