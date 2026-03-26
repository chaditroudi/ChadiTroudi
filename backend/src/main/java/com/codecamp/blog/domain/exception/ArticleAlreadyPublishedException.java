package com.codecamp.blog.domain.exception;

import com.codecamp.blog.domain.model.ArticleId;

public class ArticleAlreadyPublishedException extends RuntimeException {
    public ArticleAlreadyPublishedException(ArticleId id) {
        super("Article already published: " + id.value());
    }
}
