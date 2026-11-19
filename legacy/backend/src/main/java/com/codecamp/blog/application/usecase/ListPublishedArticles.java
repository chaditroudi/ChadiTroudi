package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;

import java.util.List;

/** Query: list published articles, optionally filtered by tag. */
public interface ListPublishedArticles {
    List<ArticleResponse> execute(String tag);
}
