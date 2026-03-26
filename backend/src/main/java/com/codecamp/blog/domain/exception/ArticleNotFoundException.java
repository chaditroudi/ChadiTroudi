package com.codecamp.blog.domain.exception;

import com.codecamp.blog.domain.model.ArticleId;

public class ArticleNotFoundException extends RuntimeException {
    public ArticleNotFoundException(ArticleId id) {
        super("Article not found: " + id.value());
    }

    public ArticleNotFoundException(String slug) {
        super("Article not found with slug: " + slug);
    }
}
