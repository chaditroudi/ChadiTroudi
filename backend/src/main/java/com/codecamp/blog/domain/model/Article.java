package com.codecamp.blog.domain.model;

import com.codecamp.blog.domain.exception.ArticleAlreadyPublishedException;
import com.codecamp.blog.domain.exception.ArticleNotPublishedException;

import java.time.Instant;
import java.util.*;

/**
 * Aggregate root — Blog Article.
 * Aligns with the React frontend's Article interface:
 *   title, excerpt, content, date, readTime, tags[], featured
 */
public class Article {

    private ArticleId id;
    private String title;
    private Slug slug;
    private String excerpt;
    private String content;
    private String readTime;
    private Set<Tag> tags;
    private boolean featured;
    private ArticleStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant publishedAt;

    // ── Factory methods ──

    public static Article create(String title, String excerpt, String content,
                                  String readTime, Set<Tag> tags, boolean featured) {
        Article article = new Article();
        article.id = ArticleId.generate();
        article.title = Objects.requireNonNull(title, "Title required");
        article.slug = Slug.fromTitle(title);
        article.excerpt = Objects.requireNonNull(excerpt, "Excerpt required");
        article.content = Objects.requireNonNull(content, "Content required");
        article.readTime = Objects.requireNonNull(readTime, "ReadTime required");
        article.tags = tags != null ? new LinkedHashSet<>(tags) : new LinkedHashSet<>();
        article.featured = featured;
        article.status = ArticleStatus.DRAFT;
        article.createdAt = Instant.now();
        article.updatedAt = article.createdAt;
        return article;
    }

    /** Reconstitute from persistence — no validation or events. */
    public static Article reconstitute(ArticleId id, String title, Slug slug,
                                        String excerpt, String content, String readTime,
                                        Set<Tag> tags, boolean featured, ArticleStatus status,
                                        Instant createdAt, Instant updatedAt, Instant publishedAt) {
        Article article = new Article();
        article.id = id;
        article.title = title;
        article.slug = slug;
        article.excerpt = excerpt;
        article.content = content;
        article.readTime = readTime;
        article.tags = tags != null ? new LinkedHashSet<>(tags) : new LinkedHashSet<>();
        article.featured = featured;
        article.status = status;
        article.createdAt = createdAt;
        article.updatedAt = updatedAt;
        article.publishedAt = publishedAt;
        return article;
    }

    // ── Domain behaviour ──

    public void publish() {
        if (this.status == ArticleStatus.PUBLISHED) {
            throw new ArticleAlreadyPublishedException(this.id);
        }
        this.status = ArticleStatus.PUBLISHED;
        this.publishedAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public void archive() {
        if (this.status != ArticleStatus.PUBLISHED) {
            throw new ArticleNotPublishedException(this.id);
        }
        this.status = ArticleStatus.ARCHIVED;
        this.updatedAt = Instant.now();
    }

    public void update(String title, String excerpt, String content,
                       String readTime, Set<Tag> tags, boolean featured) {
        if (title != null && !title.isBlank()) {
            this.title = title;
            this.slug = Slug.fromTitle(title);
        }
        if (excerpt != null) this.excerpt = excerpt;
        if (content != null) this.content = content;
        if (readTime != null) this.readTime = readTime;
        if (tags != null) this.tags = new LinkedHashSet<>(tags);
        this.featured = featured;
        this.updatedAt = Instant.now();
    }

    // ── Getters (no setters — mutations via domain methods only) ──

    public ArticleId getId() { return id; }
    public String getTitle() { return title; }
    public Slug getSlug() { return slug; }
    public String getExcerpt() { return excerpt; }
    public String getContent() { return content; }
    public String getReadTime() { return readTime; }
    public Set<Tag> getTags() { return Collections.unmodifiableSet(tags); }
    public boolean isFeatured() { return featured; }
    public ArticleStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getPublishedAt() { return publishedAt; }

    private Article() {} // force factory usage
}
