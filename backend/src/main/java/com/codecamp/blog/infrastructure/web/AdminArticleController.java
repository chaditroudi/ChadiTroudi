package com.codecamp.blog.infrastructure.web;

import com.codecamp.blog.application.dto.ArticleResponse;
import com.codecamp.blog.application.dto.CreateArticleCommand;
import com.codecamp.blog.application.dto.UpdateArticleCommand;
import com.codecamp.blog.application.service.ArticleCommandService;
import com.codecamp.blog.application.service.ArticleQueryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin blog API — requires authenticated admin user.
 */
@RestController
@RequestMapping("/api/v1/admin/blog")
public class AdminArticleController {

    private final ArticleCommandService commandService;
    private final ArticleQueryService queryService;

    public AdminArticleController(ArticleCommandService commandService,
                                   ArticleQueryService queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }

    /** GET /api/v1/admin/blog/articles — all articles (draft, published, archived) */
    @GetMapping("/articles")
    public ResponseEntity<List<ArticleResponse>> listAll() {
        return ResponseEntity.ok(queryService.executeAll());
    }

    /** POST /api/v1/admin/blog/articles */
    @PostMapping("/articles")
    public ResponseEntity<ArticleResponse> create(@Valid @RequestBody CreateArticleCommand command) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandService.execute(command));
    }

    /** PUT /api/v1/admin/blog/articles/{id} */
    @PutMapping("/articles/{id}")
    public ResponseEntity<ArticleResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody UpdateArticleCommand command) {
        return ResponseEntity.ok(commandService.execute(id, command));
    }

    /** POST /api/v1/admin/blog/articles/{id}/publish */
    @PostMapping("/articles/{id}/publish")
    public ResponseEntity<ArticleResponse> publish(@PathVariable String id) {
        return ResponseEntity.ok(commandService.execute(id));
    }

    /** POST /api/v1/admin/blog/articles/{id}/archive */
    @PostMapping("/articles/{id}/archive")
    public ResponseEntity<ArticleResponse> archive(@PathVariable String id) {
        return ResponseEntity.ok(commandService.archive(id));
    }

    /** DELETE /api/v1/admin/blog/articles/{id} */
    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        commandService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
