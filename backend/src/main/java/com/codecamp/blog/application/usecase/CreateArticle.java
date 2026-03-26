package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.dto.CreateArticleCommand;

/** Command: create a new article (admin). */
public interface CreateArticle {
    ArticleResponse execute(CreateArticleCommand command);
}
