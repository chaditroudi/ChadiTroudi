import { useState } from "react";
import { SectionHeading } from "./AboutSection";
import { Github, Linkedin, Mail, Send, User, MessageSquare, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/hooks/use-lang";

const EMAIL = "chadi.troudi@example.com";

const ContactSection = () => {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.contact.nameRequired;
    if (!form.email.trim()) e.email = t.contact.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.contact.emailInvalid;
    if (!form.message.trim()) e.message = t.contact.messageRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`);
    const body = encodeURIComponent(
      `Hi Chadi,\n\n${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    toast({
      title: t.contact.toastTitle,
      description: t.contact.toastDesc,
    });

    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl bg-background border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${
      hasError ? "border-destructive" : "border-border"
    }`;

  return (
    <section id="contact" className="py-32 relative">
      <div className="section-divider mb-32" />

      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "hsl(152 68% 46% / 0.08)" }}
      />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <AnimatedSection>
          <SectionHeading number="06" title={t.contact.title} />
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          {/* Left */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-6">
              <p className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                {t.contact.greeting}{" "}
                <span className="text-gradient">{t.contact.greetingHighlight}</span>.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.contact.desc}
              </p>

              <div className="flex items-center gap-3 pt-4">
                {[
                  { href: "https://github.com/chaditroudi", icon: <Github size={18} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={18} />, label: "LinkedIn" },
                  { href: `mailto:${EMAIL}`, icon: <Mail size={18} />, label: "Email" },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    whileHover={{ y: -3, scale: 1.05 }}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.2} direction="right">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass rounded-2xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User size={13} className="text-primary" /> {t.contact.name}
                  </label>
                  <input
                    id="name"
                    type="text"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mail size={13} className="text-primary" /> {t.contact.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder={t.contact.emailPlaceholder}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare size={13} className="text-primary" /> {t.contact.subject}
                  <span className="text-muted-foreground text-xs">{t.contact.optional}</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder={t.contact.subjectPlaceholder}
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Send size={13} className="text-primary" /> {t.contact.message}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  className={`${inputClass(!!errors.message)} resize-none`}
                />
                {errors.message && <p className="text-destructive text-xs mt-1.5">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:shadow-[0_8px_30px_-4px_hsl(152_68%_46%/0.4)] transition-all duration-300"
              >
                {t.contact.send}
                <ArrowRight size={16} />
              </motion.button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
