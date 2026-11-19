package com.codecamp.blog.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateArticleCommand(
    @NotBlank @Size(max = 200) String title,
    @NotBlank @Size(max = 500) String excerpt,
    @NotBlank String content,
    @NotBlank @Size(max = 20) String readTime,
    Set<String> tags,
    boolean featured
) {}
