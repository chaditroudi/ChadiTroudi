package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.dto.UpdateArticleCommand;

/** Command: update an existing article (admin). */
public interface UpdateArticle {
    ArticleResponse execute(String id, UpdateArticleCommand command);
}
