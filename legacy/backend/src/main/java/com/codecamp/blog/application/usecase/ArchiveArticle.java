package com.codecamp.blog.application.usecase;

import com.codecamp.blog.application.dto.ArticleResponse;

/** Command: archive a published article (admin). */
public interface ArchiveArticle {
    ArticleResponse execute(String id);
}
