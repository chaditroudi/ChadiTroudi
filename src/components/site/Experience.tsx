import { experience, formatPeriod, skills, type Role } from "@/content/profile";
import { Reveal, TagList } from "./primitives";

/** Timeline of roles. `compact` shows one highlight per role (home page); full shows everything (experience page / HTML CV). */
export const ExperienceTimeline = ({ compact = false }: { compact?: boolean }) => (
  <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
    {experience.map((role, i) => (
      <li key={role.id} className="relative">
        <span
          aria-hidden
          className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-background sm:-left-[39px] ${role.end === "present" ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/50"}`}
        />
        <Reveal delay={Math.min(i * 0.05, 0.2)}>
          <RoleEntry role={role} compact={compact} />
        </Reveal>
      </li>
    ))}
  </ol>
);

const RoleEntry = ({ role, compact }: { role: Role; compact: boolean }) => (
  <article className="space-y-3">
    <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {role.company}
          {role.companyNote && <span className="font-normal text-muted-foreground"> · {role.companyNote}</span>}
        </h3>
        <p className="text-sm text-foreground/80">{role.title}</p>
      </div>
      <p className="shrink-0 font-mono text-xs text-muted-foreground">
        <time dateTime={role.start}>{formatPeriod(role).split(" – ")[0]}</time> – {formatPeriod(role).split(" – ")[1]}
        <span className="block sm:text-right">{role.engagement}</span>
      </p>
    </header>

    {compact ? (
      <p className="text-sm leading-relaxed text-muted-foreground">{role.summary}</p>
    ) : (
      <>
        <p className="text-sm text-muted-foreground">{role.summary}</p>
        {role.highlights.length > 0 && (
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {role.highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        )}
        {role.projects?.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    )}
    <TagList items={compact ? role.stack.slice(0, 6) : role.stack} label={`${role.company} tech stack`} />
  </article>
);

export const SkillGroups = () => (
  <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
    {skills.map((group) => (
      <div key={group.name} className="space-y-2.5">
        <dt className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{group.name}</dt>
        <dd>
          <TagList items={group.items} label={`${group.name} skills`} />
        </dd>
      </div>
    ))}
  </dl>
);
