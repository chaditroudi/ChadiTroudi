-- V1 — Blog articles table
CREATE TABLE articles (
    id          UUID PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    slug        VARCHAR(250) NOT NULL UNIQUE,
    excerpt     VARCHAR(500) NOT NULL,
    content     TEXT NOT NULL,
    read_time   VARCHAR(20) NOT NULL,
    tags        TEXT,
    featured    BOOLEAN NOT NULL DEFAULT FALSE,
    status      VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_published_at ON articles (published_at DESC);

-- Seed the 4 articles from the React frontend
INSERT INTO articles (id, title, slug, excerpt, content, read_time, tags, featured, status, created_at, updated_at, published_at) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'Why Java Is Still the King of Backend Development in 2026',
    'why-java-is-still-the-king-of-backend-development-in-2026',
    'With modern frameworks like Spring Boot 3.x and virtual threads, Java continues to dominate enterprise-grade backend systems.',
    E'Java has been the backbone of enterprise development for decades, and in 2026, it''s stronger than ever. With the introduction of virtual threads (Project Loom), the performance gap between Java and languages like Go has narrowed significantly.\n\nSpring Boot 3.x brings native compilation via GraalVM, reducing startup times to milliseconds. Combined with the massive ecosystem of libraries, battle-tested reliability, and the sheer number of Java developers worldwide, it remains the go-to choice for building scalable microservices.\n\nKey reasons Java thrives:\n• Virtual Threads — handle millions of concurrent connections without the complexity of reactive programming\n• GraalVM Native — startup in under 100ms, perfect for serverless\n• Spring Boot 3.x — simplified configuration, better observability\n• Mature ecosystem — every problem has a well-tested library\n• Enterprise trust — banks, airlines, and governments rely on Java\n\nIf you''re starting your backend career, Java is still one of the best investments you can make.',
    '5 min read',
    'Java,Backend,Spring Boot',
    true,
    'PUBLISHED',
    '2026-03-05T00:00:00Z',
    '2026-03-05T00:00:00Z',
    '2026-03-05T00:00:00Z'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'From Zero to Junior Dev: My 10-Day Java Bootcamp Approach',
    'from-zero-to-junior-dev-my-10-day-java-bootcamp-approach',
    'How I structure my intensive bootcamp to turn complete beginners into confident Java developers in just 10 days.',
    E'After teaching dozens of students, I''ve refined a method that works: focus on fundamentals, build real things, and learn databases early.\n\nThe 10-day structure:\nDays 1-4: Java fundamentals — not just theory, but building small programs from day one. Variables, OOP, collections, and streams through hands-on exercises.\n\nDays 5-7: SQL & Databases — because no real application exists without data. Students learn PostgreSQL, write complex queries, and connect Java to databases via JDBC.\n\nDays 8-10: Final Project — this is where everything clicks. Students build a complete application from scratch, present it, and walk away with a portfolio piece.\n\nThe key insight: students learn faster when they can see their code DO something. Every concept is taught through building, not slides.',
    '4 min read',
    'Teaching,Java,Bootcamp',
    false,
    'PUBLISHED',
    '2026-02-28T00:00:00Z',
    '2026-02-28T00:00:00Z',
    '2026-02-28T00:00:00Z'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'Debugging AWS RDS Performance at Scale: Lessons from Bonial',
    'debugging-aws-rds-performance-at-scale-lessons-from-bonial',
    'Real-world strategies for diagnosing and fixing PostgreSQL performance issues on AWS RDS in a high-traffic production environment.',
    E'At Bonial, we serve millions of users across Europe. When our RDS instance started showing elevated latency, we had to act fast.\n\nHere''s what we learned:\n\n1. Performance Insights is your best friend — AWS provides detailed query-level metrics. We identified a slow JOIN that was scanning 2M+ rows.\n\n2. Indexing strategy matters — adding a composite index on (store_id, created_at) reduced query time from 3.2s to 12ms.\n\n3. Connection pooling — switching to PgBouncer reduced our connection count by 80%% and eliminated timeout errors.\n\n4. Read replicas for analytics — moving reporting queries to a read replica freed up the primary for writes.\n\n5. Monitoring culture — we now have alerts on p99 latency, connection count, and IOPS. Issues get caught before users notice.\n\nThe takeaway: database performance is not a one-time fix. It''s a culture of monitoring, measuring, and iterating.',
    '6 min read',
    'AWS,PostgreSQL,DevOps',
    false,
    'PUBLISHED',
    '2026-02-15T00:00:00Z',
    '2026-02-15T00:00:00Z',
    '2026-02-15T00:00:00Z'
),
(
    'a1000000-0000-0000-0000-000000000004',
    'Clean Architecture in Spring Boot: A Practical Guide',
    'clean-architecture-in-spring-boot-a-practical-guide',
    'How to structure your Spring Boot application for maintainability, testability, and long-term success.',
    E'After working on multiple enterprise projects, I''ve settled on a clean architecture approach for Spring Boot that scales well.\n\nThe structure:\n├── domain/          # Entities, value objects, domain services\n├── application/     # Use cases, DTOs, port interfaces\n├── infrastructure/  # JPA repos, external APIs, configs\n└── presentation/    # REST controllers, request/response models\n\nKey principles:\n• Domain layer has ZERO dependencies on frameworks\n• Use cases orchestrate business logic\n• Infrastructure implements interfaces defined in the application layer\n• Controllers are thin — they just map HTTP to use cases\n\nBenefits I''ve seen:\n- Unit tests run in milliseconds (no Spring context needed)\n- Swapping databases or APIs is a config change\n- New developers understand the codebase in days, not weeks\n- Business logic is protected from framework upgrades\n\nThis isn''t theoretical — this is how we build at Bonial, and it''s how I teach in my bootcamp.',
    '7 min read',
    'Architecture,Spring Boot,Best Practices',
    false,
    'PUBLISHED',
    '2026-01-30T00:00:00Z',
    '2026-01-30T00:00:00Z',
    '2026-01-30T00:00:00Z'
);
