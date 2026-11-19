package com.codecamp.blog.infrastructure.persistence;

import com.codecamp.blog.domain.model.*;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ArticlePersistenceMapperTest {

    private final ArticlePersistenceMapper mapper = new ArticlePersistenceMapper();

    @Test
    void roundTrip_domainToJpaAndBack() {
        Article original = Article.create(
            "Test Article", "excerpt", "full content",
            "5 min read", Set.of(new Tag("Java"), new Tag("Spring Boot")), true
        );
        original.publish();

        ArticleJpaEntity jpa = mapper.toJpa(original);

        assertEquals(original.getId().value(), jpa.getId());
        assertEquals("test-article", jpa.getSlug());
        assertEquals("Java,Spring Boot", jpa.getTags());
        assertEquals(ArticleJpaEntity.ArticleStatusJpa.PUBLISHED, jpa.getStatus());

        Article restored = mapper.toDomain(jpa);

        assertEquals(original.getId(), restored.getId());
        assertEquals(original.getTitle(), restored.getTitle());
        assertEquals(original.getSlug(), restored.getSlug());
        assertEquals(original.getExcerpt(), restored.getExcerpt());
        assertEquals(original.getContent(), restored.getContent());
        assertEquals(original.getReadTime(), restored.getReadTime());
        assertEquals(original.isFeatured(), restored.isFeatured());
        assertEquals(original.getStatus(), restored.getStatus());
        assertEquals(original.getTags().size(), restored.getTags().size());
    }

    @Test
    void toDomain_handlesEmptyTags() {
        ArticleJpaEntity jpa = new ArticleJpaEntity();
        jpa.setId(java.util.UUID.randomUUID());
        jpa.setTitle("No Tags");
        jpa.setSlug("no-tags");
        jpa.setExcerpt("exc");
        jpa.setContent("content");
        jpa.setReadTime("2 min");
        jpa.setTags("");
        jpa.setFeatured(false);
        jpa.setStatus(ArticleJpaEntity.ArticleStatusJpa.DRAFT);
        jpa.setCreatedAt(Instant.now());
        jpa.setUpdatedAt(Instant.now());

        Article article = mapper.toDomain(jpa);
        assertTrue(article.getTags().isEmpty());
    }
}
