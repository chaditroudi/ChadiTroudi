package com.codecamp.blog.domain.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TagTest {

    @Test
    void validTag() {
        Tag tag = new Tag("Java");
        assertEquals("Java", tag.value());
    }

    @Test
    void trimmed() {
        Tag tag = new Tag("  Spring Boot  ");
        assertEquals("Spring Boot", tag.value());
    }

    @Test
    void rejectsNull() {
        assertThrows(NullPointerException.class, () -> new Tag(null));
    }

    @Test
    void rejectsEmpty() {
        assertThrows(IllegalArgumentException.class, () -> new Tag(""));
    }

    @Test
    void rejectsTooLong() {
        String longTag = "a".repeat(51);
        assertThrows(IllegalArgumentException.class, () -> new Tag(longTag));
    }
}
