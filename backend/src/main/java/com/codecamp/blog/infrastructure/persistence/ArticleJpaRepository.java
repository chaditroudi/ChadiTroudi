package com.codecamp.blog.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleJpaRepository extends JpaRepository<ArticleJpaEntity, UUID> {

    Optional<ArticleJpaEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<ArticleJpaEntity> findAllByStatus(ArticleJpaEntity.ArticleStatusJpa status);

    @Query("SELECT a FROM ArticleJpaEntity a WHERE a.status = :status AND a.tags LIKE %:tag%")
    List<ArticleJpaEntity> findAllByStatusAndTagContaining(ArticleJpaEntity.ArticleStatusJpa status, String tag);
}
