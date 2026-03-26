package com.codecamp.blog.infrastructure.web;

import com.codecamp.blog.domain.exception.ArticleAlreadyPublishedException;
import com.codecamp.blog.domain.exception.ArticleNotFoundException;
import com.codecamp.blog.domain.exception.ArticleNotPublishedException;
import com.codecamp.blog.domain.exception.DuplicateSlugException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.codecamp.blog")
public class BlogExceptionHandler {

    @ExceptionHandler(ArticleNotFoundException.class)
    public ProblemDetail handleNotFound(ArticleNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Article Not Found");
        return pd;
    }

    @ExceptionHandler(DuplicateSlugException.class)
    public ProblemDetail handleDuplicateSlug(DuplicateSlugException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Duplicate Slug");
        return pd;
    }

    @ExceptionHandler(ArticleAlreadyPublishedException.class)
    public ProblemDetail handleAlreadyPublished(ArticleAlreadyPublishedException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Already Published");
        return pd;
    }

    @ExceptionHandler(ArticleNotPublishedException.class)
    public ProblemDetail handleNotPublished(ArticleNotPublishedException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Not Published");
        return pd;
    }
}
