package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;

/** Query: get a single published article by slug. */
public interface GetArticleBySlug {
    ArticleResponse execute(String slug);
}
