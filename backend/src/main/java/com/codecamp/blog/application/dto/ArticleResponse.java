package com.codecamp.blog.application.dto;

import java.time.Instant;
import java.util.List;

/**
 * DTO returned to the frontend — matches the React Article interface:
 * { title, excerpt, content, date, readTime, tags[], featured, slug, status }
 */
public record ArticleResponse(
    String id,
    String title,
    String slug,
    String excerpt,
    String content,
    String readTime,
    String date,
    List<String> tags,
    boolean featured,
    String status,
    Instant createdAt,
    Instant updatedAt,
    Instant publishedAt
) {}
