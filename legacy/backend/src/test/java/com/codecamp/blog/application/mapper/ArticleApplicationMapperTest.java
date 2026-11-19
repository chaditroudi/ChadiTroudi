package com.codecamp.blog.application.mapper;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.domain.model.Article;
import com.codecamp.blog.domain.model.Tag;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ArticleApplicationMapperTest {

    private final ArticleApplicationMapper mapper = new ArticleApplicationMapper();

    @Test
    void toResponse_mapsAllFields() {
        Article article = Article.create(
            "Test", "excerpt", "content", "5 min read",
            Set.of(new Tag("Java")), true
        );
        article.publish();

        ArticleResponse resp = mapper.toResponse(article);

        assertEquals(article.getId().value().toString(), resp.id());
        assertEquals("Test", resp.title());
        assertEquals("test", resp.slug());
        assertEquals("excerpt", resp.excerpt());
        assertEquals("content", resp.content());
        assertEquals("5 min read", resp.readTime());
        assertTrue(resp.featured());
        assertEquals("published", resp.status());
        assertEquals(1, resp.tags().size());
        assertEquals("Java", resp.tags().get(0));
        assertNotNull(resp.date()); // formatted date
        assertNotNull(resp.publishedAt());
    }
}
