package com.codecamp.blog.domain.model;

import com.codecamp.blog.domain.exception.ArticleAlreadyPublishedException;
import com.codecamp.blog.domain.exception.ArticleNotPublishedException;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ArticleTest {

    private Article createDraft() {
        return Article.create(
            "Test Title",
            "Test excerpt",
            "Full content here",
            "5 min read",
            Set.of(new Tag("Java"), new Tag("Spring Boot")),
            false
        );
    }

    @Test
    void create_setsFieldsCorrectly() {
        Article article = createDraft();

        assertNotNull(article.getId());
        assertEquals("Test Title", article.getTitle());
        assertEquals("test-title", article.getSlug().value());
        assertEquals("Test excerpt", article.getExcerpt());
        assertEquals("Full content here", article.getContent());
        assertEquals("5 min read", article.getReadTime());
        assertEquals(2, article.getTags().size());
        assertFalse(article.isFeatured());
        assertEquals(ArticleStatus.DRAFT, article.getStatus());
        assertNotNull(article.getCreatedAt());
        assertNull(article.getPublishedAt());
    }

    @Test
    void publish_setStatusAndDate() {
        Article article = createDraft();
        article.publish();

        assertEquals(ArticleStatus.PUBLISHED, article.getStatus());
        assertNotNull(article.getPublishedAt());
    }

    @Test
    void publish_twice_throws() {
        Article article = createDraft();
        article.publish();

        assertThrows(ArticleAlreadyPublishedException.class, article::publish);
    }

    @Test
    void archive_published_works() {
        Article article = createDraft();
        article.publish();
        article.archive();

        assertEquals(ArticleStatus.ARCHIVED, article.getStatus());
    }

    @Test
    void archive_draft_throws() {
        Article article = createDraft();
        assertThrows(ArticleNotPublishedException.class, article::archive);
    }

    @Test
    void update_changesFieldsAndSlug() {
        Article article = createDraft();
        article.update("New Title", "New excerpt", null, null, null, true);

        assertEquals("New Title", article.getTitle());
        assertEquals("new-title", article.getSlug().value());
        assertEquals("New excerpt", article.getExcerpt());
        assertEquals("Full content here", article.getContent()); // unchanged
        assertTrue(article.isFeatured());
    }

    @Test
    void tags_areUnmodifiable() {
        Article article = createDraft();
        assertThrows(UnsupportedOperationException.class, () ->
            article.getTags().add(new Tag("Hack"))
        );
    }
}
