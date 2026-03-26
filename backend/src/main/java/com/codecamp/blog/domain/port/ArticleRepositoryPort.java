package com.codecamp.blog.domain.port;

import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.ArticleId;
import com.codecamp.blog.domain.model.ArticleStatus;
import com.codecamp.blog.domain.model.Slug;

import java.util.List;
import java.util.Optional;

/**
 * Output port — the domain defines WHAT it needs, infrastructure provides HOW.
 */
public interface ArticleRepositoryPort {

    Article save(Article article);

    Optional<Article> findById(ArticleId id);

    Optional<Article> findBySlug(Slug slug);

    List<Article> findAllByStatus(ArticleStatus status);

    List<Article> findAllByStatusAndTag(ArticleStatus status, String tag);

    List<Article> findAll();

    void deleteById(ArticleId id);

    boolean existsBySlug(Slug slug);
}
