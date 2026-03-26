package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;

/** Command: publish a draft article (admin). */
public interface PublishArticle {
    ArticleResponse execute(String id);
}
