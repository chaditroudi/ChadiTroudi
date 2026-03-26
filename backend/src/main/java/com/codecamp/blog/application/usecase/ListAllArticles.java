package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;

import java.util.List;

/** Query: list all articles (admin — includes drafts, archived). */
public interface ListAllArticles {
    List<ArticleResponse> execute();
}
