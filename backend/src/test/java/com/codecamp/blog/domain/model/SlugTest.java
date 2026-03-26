package com.codecamp.blog.domain.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class SlugTest {

    @Test
    void fromTitle_createsUrlFriendlySlug() {
        Slug slug = Slug.fromTitle("Why Java Is Still the King");
        assertEquals("why-java-is-still-the-king", slug.value());
    }

    @Test
    void fromTitle_handlesSpecialCharacters() {
        Slug slug = Slug.fromTitle("Spring Boot 3.x: What's New?");
        assertEquals("spring-boot-3x-whats-new", slug.value());
    }

    @Test
    void fromTitle_collapsesMultipleSpacesAndHyphens() {
        Slug slug = Slug.fromTitle("too   many   spaces");
        assertEquals("too-many-spaces", slug.value());
    }

    @Test
    void fromTitle_trimsDashes() {
        Slug slug = Slug.fromTitle(" - Hello World - ");
        assertEquals("hello-world", slug.value());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "!!!"})
    void fromTitle_rejectsEmptyOrSymbolOnlyTitles(String title) {
        assertThrows(IllegalArgumentException.class, () -> Slug.fromTitle(title));
    }

    @Test
    void fromTitle_rejectsNull() {
        assertThrows(NullPointerException.class, () -> Slug.fromTitle(null));
    }

    @Test
    void constructor_rejectsBlankSlug() {
        assertThrows(IllegalArgumentException.class, () -> new Slug("   "));
    }
}
