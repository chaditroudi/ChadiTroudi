import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Tag, ChevronDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface Article {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

const articles: Article[] = [
  {
    title: "Why Java Is Still the King of Backend Development in 2026",
    excerpt: "With modern frameworks like Spring Boot 3.x and virtual threads, Java continues to dominate enterprise-grade backend systems.",
    content: `Java has been the backbone of enterprise development for decades, and in 2026, it's stronger than ever. With the introduction of virtual threads (Project Loom), the performance gap between Java and languages like Go has narrowed significantly.

Spring Boot 3.x brings native compilation via GraalVM, reducing startup times to milliseconds. Combined with the massive ecosystem of libraries, battle-tested reliability, and the sheer number of Java developers worldwide, it remains the go-to choice for building scalable microservices.

Key reasons Java thrives:
• Virtual Threads — handle millions of concurrent connections without the complexity of reactive programming
• GraalVM Native — startup in under 100ms, perfect for serverless
• Spring Boot 3.x — simplified configuration, better observability
• Mature ecosystem — every problem has a well-tested library
• Enterprise trust — banks, airlines, and governments rely on Java

If you're starting your backend career, Java is still one of the best investments you can make.`,
    date: "Mar 5, 2026",
    readTime: "5 min read",
    tags: ["Java", "Backend", "Spring Boot"],
    featured: true,
  },
  {
    title: "From Zero to Junior Dev: My 10-Day Java Bootcamp Approach",
    excerpt: "How I structure my intensive bootcamp to turn complete beginners into confident Java developers in just 10 days.",
    content: `After teaching dozens of students, I've refined a method that works: focus on fundamentals, build real things, and learn databases early.

The 10-day structure:
Days 1-4: Java fundamentals — not just theory, but building small programs from day one. Variables, OOP, collections, and streams through hands-on exercises.

Days 5-7: SQL & Databases — because no real application exists without data. Students learn PostgreSQL, write complex queries, and connect Java to databases via JDBC.

Days 8-10: Final Project — this is where everything clicks. Students build a complete application from scratch, present it, and walk away with a portfolio piece.

The key insight: students learn faster when they can see their code DO something. Every concept is taught through building, not slides.`,
    date: "Feb 28, 2026",
    readTime: "4 min read",
    tags: ["Teaching", "Java", "Bootcamp"],
  },
  {
    title: "Debugging AWS RDS Performance at Scale: Lessons from Bonial",
    excerpt: "Real-world strategies for diagnosing and fixing PostgreSQL performance issues on AWS RDS in a high-traffic production environment.",
    content: `At Bonial, we serve millions of users across Europe. When our RDS instance started showing elevated latency, we had to act fast.

Here's what we learned:

1. Performance Insights is your best friend — AWS provides detailed query-level metrics. We identified a slow JOIN that was scanning 2M+ rows.

2. Indexing strategy matters — adding a composite index on (store_id, created_at) reduced query time from 3.2s to 12ms.

3. Connection pooling — switching to PgBouncer reduced our connection count by 80% and eliminated timeout errors.

4. Read replicas for analytics — moving reporting queries to a read replica freed up the primary for writes.

5. Monitoring culture — we now have alerts on p99 latency, connection count, and IOPS. Issues get caught before users notice.

The takeaway: database performance is not a one-time fix. It's a culture of monitoring, measuring, and iterating.`,
    date: "Feb 15, 2026",
    readTime: "6 min read",
    tags: ["AWS", "PostgreSQL", "DevOps"],
  },
  {
    title: "Clean Architecture in Spring Boot: A Practical Guide",
    excerpt: "How to structure your Spring Boot application for maintainability, testability, and long-term success.",
    content: `After working on multiple enterprise projects, I've settled on a clean architecture approach for Spring Boot that scales well.

The structure:
├── domain/          # Entities, value objects, domain services
├── application/     # Use cases, DTOs, port interfaces
├── infrastructure/  # JPA repos, external APIs, configs
└── presentation/    # REST controllers, request/response models

Key principles:
• Domain layer has ZERO dependencies on frameworks
• Use cases orchestrate business logic
• Infrastructure implements interfaces defined in the application layer
• Controllers are thin — they just map HTTP to use cases

Benefits I've seen:
- Unit tests run in milliseconds (no Spring context needed)
- Swapping databases or APIs is a config change
- New developers understand the codebase in days, not weeks
- Business logic is protected from framework upgrades

This isn't theoretical — this is how we build at Bonial, and it's how I teach in my bootcamp.`,
    date: "Jan 30, 2026",
    readTime: "7 min read",
    tags: ["Architecture", "Spring Boot", "Best Practices"],
  },
];

const BlogSection = () => {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const allTags = [...new Set(articles.flatMap((a) => a.tags))];
  const filtered = filter ? articles.filter((a) => a.tags.includes(filter)) : articles;

  return (
    <section id="blog" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/10 to-background" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
              <BookOpen size={12} className="text-primary" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">Blog & Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Articles & <span className="text-gradient">Thoughts</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
              Sharing knowledge from the trenches — Java, cloud engineering, teaching, and career growth.
            </p>
          </div>
        </AnimatedSection>

        {/* Tag filters */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !filter ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(filter === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === tag ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Articles */}
        <div className="space-y-4">
          {filtered.map((article, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <motion.article
                layout
                onClick={() => setExpandedArticle(expandedArticle === i ? null : i)}
                className={`rounded-2xl border bg-card/50 backdrop-blur-sm cursor-pointer transition-all duration-300 overflow-hidden ${
                  expandedArticle === i ? "border-primary/30 shadow-lg" : "border-border/50 hover:border-primary/20 hover:shadow-md"
                } ${article.featured ? "ring-1 ring-primary/10" : ""}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {article.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Featured</span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" /> {article.readTime}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{article.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {article.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div animate={{ rotate: expandedArticle === i ? 180 : 0 }} className="shrink-0 mt-1">
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandedArticle === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-border/30">
                          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                            {article.content}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
