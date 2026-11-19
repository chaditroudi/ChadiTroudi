import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ComponentProps, ReactNode } from "react";
import { buttonStyles } from "@/lib/button-styles";
import { cn } from "@/lib/utils";

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6", className)}>{children}</div>
);

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary", className)}>{children}</p>
);

export const Section = ({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) => (
  <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={cn("py-16 sm:py-20", className)}>
    <Container>
      {(eyebrow || title) && (
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 id={id ? `${id}-title` : undefined} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Container>
  </section>
);

/** Fade-and-rise on first scroll into view. MotionConfig in the layout honours prefers-reduced-motion. */
export const Reveal = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const Tag = ({ children }: { children: ReactNode }) => (
  <li className="rounded-md border border-border bg-foreground/[0.03] px-2 py-0.5 font-mono text-xs text-muted-foreground">
    {children}
  </li>
);

export const TagList = ({ items, className, label }: { items: readonly string[]; className?: string; label: string }) => (
  <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
    {items.map((t) => (
      <Tag key={t}>{t}</Tag>
    ))}
  </ul>
);

type Variant = keyof typeof buttonStyles;

export const ButtonLink = ({
  to,
  variant = "primary",
  className,
  ...props
}: { to: string; variant?: Variant } & Omit<ComponentProps<typeof Link>, "to">) => (
  <Link to={to} className={cn(buttonStyles[variant], className)} {...props} />
);

export const ButtonAnchor = ({ variant = "primary", className, ...props }: { variant?: Variant } & ComponentProps<"a">) => (
  <a className={cn(buttonStyles[variant], className)} {...props} />
);
