package com.codecamp.blog.domain.model;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ArticleIdTest {

    @Test
    void generate_createsUniqueId() {
        ArticleId a = ArticleId.generate();
        ArticleId b = ArticleId.generate();
        assertNotEquals(a, b);
    }

    @Test
    void of_uuid_works() {
        UUID uuid = UUID.randomUUID();
        ArticleId id = ArticleId.of(uuid);
        assertEquals(uuid, id.value());
    }

    @Test
    void of_string_works() {
        String str = "550e8400-e29b-41d4-a716-446655440000";
        ArticleId id = ArticleId.of(str);
        assertEquals(UUID.fromString(str), id.value());
    }

    @Test
    void rejectsNull() {
        assertThrows(NullPointerException.class, () -> ArticleId.of((UUID) null));
    }
}
