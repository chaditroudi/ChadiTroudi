package com.codecamp.blog.domain.exception;

import com.codecamp.blog.domain.model.ArticleId;

public class ArticleNotPublishedException extends RuntimeException {
    public ArticleNotPublishedException(ArticleId id) {
        super("Article is not published: " + id.value());
    }
}
