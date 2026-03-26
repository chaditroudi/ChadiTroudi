package com.codecamp.blog.application.service;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.dto.CreateArticleCommand;
import com.codecamp.blog.application.dto.UpdateArticleCommand;
import com.codecamp.blog.application.mapper.ArticleApplicationMapper;
import com.codecamp.blog.application.usecase.*;
import com.codecamp.blog.domain.exception.ArticleNotFoundException;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.ArticleId;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.model.Tag;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;
import com.codecamp.blog.domain.service.ArticleDomainService;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Command-side application service.
 */
public class ArticleCommandService implements CreateArticle, UpdateArticle, PublishArticle, ArchiveArticle, DeleteArticle {

    private final ArticleRepositoryPort repository;
    private final ArticleDomainService domainService;
    private final ArticleApplicationMapper mapper;

    public ArticleCommandService(ArticleRepositoryPort repository,
                                  ArticleDomainService domainService,
                                  ArticleApplicationMapper mapper) {
        this.repository = repository;
        this.domainService = domainService;
        this.mapper = mapper;
    }

    @Override
    public ArticleResponse execute(CreateArticleCommand command) {
        Set<Tag> tags = toTags(command.tags());
        Article article = Article.create(
            command.title(),
            command.excerpt(),
            command.content(),
            command.readTime(),
            tags,
            command.featured()
        );
        domainService.ensureSlugUnique(article.getSlug());
        Article saved = repository.save(article);
        return mapper.toResponse(saved);
    }

    @Override
    public ArticleResponse execute(String id, UpdateArticleCommand command) {
        ArticleId articleId = ArticleId.of(id);
        Article article = repository.findById(articleId)
            .orElseThrow(() -> new ArticleNotFoundException(articleId));

        Set<Tag> tags = toTags(command.tags());
        article.update(command.title(), command.excerpt(), command.content(),
                       command.readTime(), tags, command.featured());

        domainService.ensureSlugUniqueExcluding(article.getSlug(), article);
        Article saved = repository.save(article);
        return mapper.toResponse(saved);
    }

    @Override
    public ArticleResponse execute(String id) {
        // This is PublishArticle — disambiguated by call site
        ArticleId articleId = ArticleId.of(id);
        Article article = repository.findById(articleId)
            .orElseThrow(() -> new ArticleNotFoundException(articleId));
        article.publish();
        Article saved = repository.save(article);
        return mapper.toResponse(saved);
    }

    public ArticleResponse archive(String id) {
        ArticleId articleId = ArticleId.of(id);
        Article article = repository.findById(articleId)
            .orElseThrow(() -> new ArticleNotFoundException(articleId));
        article.archive();
        Article saved = repository.save(article);
        return mapper.toResponse(saved);
    }

    public void delete(String id) {
        ArticleId articleId = ArticleId.of(id);
        if (repository.findById(articleId).isEmpty()) {
            throw new ArticleNotFoundException(articleId);
        }
        repository.deleteById(articleId);
    }

    private Set<Tag> toTags(Set<String> raw) {
        if (raw == null) return new LinkedHashSet<>();
        return raw.stream()
            .map(Tag::new)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
