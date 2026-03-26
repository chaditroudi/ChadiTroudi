package com.codecamp.blog.infrastructure.config;

import com.codecamp.blog.application.mapper.ArticleApplicationMapper;
import com.codecamp.blog.application.service.ArticleCommandService;
import com.codecamp.blog.application.service.ArticleQueryService;
import com.codecamp.blog.domain.port.ArticleRepositoryPort;
import com.codecamp.blog.domain.service.ArticleDomainService;
import com.codecamp.blog.infrastructure.persistence.ArticleJpaRepository;
import com.codecamp.blog.infrastructure.persistence.ArticlePersistenceMapper;
import com.codecamp.blog.infrastructure.persistence.ArticleRepositoryAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires the Blog bounded context — keeps domain & application layers
 * free of Spring annotations.
 */
@Configuration
public class BlogConfig {

    @Bean
    public ArticlePersistenceMapper articlePersistenceMapper() {
        return new ArticlePersistenceMapper();
    }

    @Bean
    public ArticleRepositoryPort articleRepositoryPort(ArticleJpaRepository jpaRepository,
                                                       ArticlePersistenceMapper persistenceMapper) {
        return new ArticleRepositoryAdapter(jpaRepository, persistenceMapper);
    }

    @Bean
    public ArticleDomainService articleDomainService(ArticleRepositoryPort repositoryPort) {
        return new ArticleDomainService(repositoryPort);
    }

    @Bean
    public ArticleApplicationMapper articleApplicationMapper() {
        return new ArticleApplicationMapper();
    }

    @Bean
    public ArticleQueryService articleQueryService(ArticleRepositoryPort repositoryPort,
                                                    ArticleApplicationMapper applicationMapper) {
        return new ArticleQueryService(repositoryPort, applicationMapper);
    }

    @Bean
    public ArticleCommandService articleCommandService(ArticleRepositoryPort repositoryPort,
                                                        ArticleDomainService domainService,
                                                        ArticleApplicationMapper applicationMapper) {
        return new ArticleCommandService(repositoryPort, domainService, applicationMapper);
    }
}
