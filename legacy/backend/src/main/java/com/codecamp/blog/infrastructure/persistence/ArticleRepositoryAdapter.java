package com.codecamp.blog.infrastructure.persistence;

import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.ArticleId;
import com.codecamp.blog.domain.model.ArticleStatus;
import com.codecamp.blog.domain.model.Slug;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;

import java.util.List;
import java.util.Optional;

/**
 * Adapter — implements the domain's repository port using Spring Data JPA.
 */
public class ArticleRepositoryAdapter implements ArticleRepositoryPort {

    private final ArticleJpaRepository jpaRepository;
    private final ArticlePersistenceMapper mapper;

    public ArticleRepositoryAdapter(ArticleJpaRepository jpaRepository, ArticlePersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Article save(Article article) {
        ArticleJpaEntity entity = mapper.toJpa(article);
        ArticleJpaEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Article> findById(ArticleId id) {
        return jpaRepository.findById(id.value()).map(mapper::toDomain);
    }

    @Override
    public Optional<Article> findBySlug(Slug slug) {
        return jpaRepository.findBySlug(slug.value()).map(mapper::toDomain);
    }

    @Override
    public List<Article> findAllByStatus(ArticleStatus status) {
        ArticleJpaEntity.ArticleStatusJpa jpaStatus =
            ArticleJpaEntity.ArticleStatusJpa.valueOf(status.name());
        return jpaRepository.findAllByStatus(jpaStatus).stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public List<Article> findAllByStatusAndTag(ArticleStatus status, String tag) {
        ArticleJpaEntity.ArticleStatusJpa jpaStatus =
            ArticleJpaEntity.ArticleStatusJpa.valueOf(status.name());
        return jpaRepository.findAllByStatusAndTagContaining(jpaStatus, tag).stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public List<Article> findAll() {
        return jpaRepository.findAll().stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public void deleteById(ArticleId id) {
        jpaRepository.deleteById(id.value());
    }

    @Override
    public boolean existsBySlug(Slug slug) {
        return jpaRepository.existsBySlug(slug.value());
    }
}
