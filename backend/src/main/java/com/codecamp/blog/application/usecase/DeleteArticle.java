package com.codecamp.blog.application.usecase;

/** Command: delete an article (admin). */
public interface DeleteArticle {
    void execute(String id);
}
