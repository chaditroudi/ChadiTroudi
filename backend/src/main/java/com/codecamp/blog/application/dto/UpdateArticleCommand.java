package com.codecamp.blog.application.dto;

import jakarta.validation.constraints.Size;

import java.util.Set;

public record UpdateArticleCommand(
    @Size(max = 200) String title,
    @Size(max = 500) String excerpt,
    String content,
    @Size(max = 20) String readTime,
    Set<String> tags,
    boolean featured
) {}
