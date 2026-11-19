package com.codecamp.blog.domain.exception;

import com.codecamp.blog.domain.model.Slug;

public class DuplicateSlugException extends RuntimeException {
    public DuplicateSlugException(Slug slug) {
        super("An article with slug already exists: " + slug.value());
    }
}
