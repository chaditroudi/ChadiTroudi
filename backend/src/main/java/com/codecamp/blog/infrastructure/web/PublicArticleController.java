package com.codecamp.blog.infrastructure.web;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.service.ArticleQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public blog API — no auth required.
 * Aligns with what the React BlogSection.tsx needs.
 */
@RestController
@RequestMapping("/api/v1/blog")
public class PublicArticleController {

    private final ArticleQueryService queryService;

    public PublicArticleController(ArticleQueryService queryService) {
        this.queryService = queryService;
    }

    /** GET /api/v1/blog/articles?tag=Java */
    @GetMapping("/articles")
    public ResponseEntity<List<ArticleResponse>> listPublished(
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(queryService.execute(tag));
    }

    /** GET /api/v1/blog/articles/{slug} */
    @GetMapping("/articles/{slug}")
    public ResponseEntity<ArticleResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(queryService.execute(slug));
    }
}
