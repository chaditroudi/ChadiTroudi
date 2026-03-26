package com.codecamp.blog.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "articles")
public class ArticleJpaEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(nullable = false, length = 500)
    private String excerpt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "read_time", nullable = false, length = 20)
    private String readTime;

    /** Stored as comma-separated string — simple, no join table needed. */
    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(nullable = false)
    private boolean featured;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ArticleStatusJpa status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    // ── JPA lifecycle ──
    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    // ── Getters & Setters ──
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public ArticleStatusJpa getStatus() { return status; }
    public void setStatus(ArticleStatusJpa status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }

    public enum ArticleStatusJpa {
        DRAFT, PUBLISHED, ARCHIVED
    }
}
