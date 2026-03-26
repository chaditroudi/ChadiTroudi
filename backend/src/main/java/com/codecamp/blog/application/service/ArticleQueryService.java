package com.codecamp.blog.application.service;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.mapper.ArticleApplicationMapper;
import com.codecamp.blog.application.usecase.GetArticleBySlug;
import com.codecamp.blog.application.usecase.ListAllArticles;
import com.codecamp.blog.application.usecase.ListPublishedArticles;
import com.codecamp.blog.domain.exception.ArticleNotFoundException;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.ArticleStatus;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;

import java.util.Comparator;
import java.util.List;

/**
 * Query-side application service.
 */
public class ArticleQueryService implements ListPublishedArticles, GetArticleBySlug, ListAllArticles {

    private final ArticleRepositoryPort repository;
    private final ArticleApplicationMapper mapper;

    public ArticleQueryService(ArticleRepositoryPort repository, ArticleApplicationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<ArticleResponse> execute(String tag) {
        List<Article> articles;
        if (tag != null && !tag.isBlank()) {
            articles = repository.findAllByStatusAndTag(ArticleStatus.PUBLISHED, tag);
        } else {
            articles = repository.findAllByStatus(ArticleStatus.PUBLISHED);
        }
        return articles.stream()
            .sorted(Comparator.comparing(Article::getPublishedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    public ArticleResponse execute(String slug) {
        Article article = repository.findBySlug(new Slug(slug))
            .filter(a -> a.getStatus() == ArticleStatus.PUBLISHED)
            .orElseThrow(() -> new ArticleNotFoundException(slug));
        return mapper.toResponse(article);
    }

    // ListAllArticles (admin) — returns all regardless of status
    public List<ArticleResponse> executeAll() {
        return repository.findAll().stream()
            .sorted(Comparator.comparing(Article::getCreatedAt).reversed())
            .map(mapper::toResponse)
            .toList();
    }

    // Implementing ListAllArticles.execute()
    List<ArticleResponse> listAll() {
        return executeAll();
    }
}
