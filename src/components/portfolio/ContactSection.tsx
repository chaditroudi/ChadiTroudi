import { useState } from "react";
import { SectionHeading } from "./AboutSection";
import { Github, Linkedin, Mail, Send, User, MessageSquare } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const EMAIL = "chadi.troudi@example.com";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
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
      title: "Opening your email client…",
      description: "Your message details have been pre-filled.",
    });

    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <section id="contact" className="py-28 relative">
      <div className="section-divider mb-28" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <AnimatedSection>
          <SectionHeading number="06" title="Get In Touch" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left — intro */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-6">
              <p className="text-3xl md:text-4xl font-bold leading-tight">
                Let's build something{" "}
                <span className="text-serif italic text-gradient">together</span>.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'm open to new opportunities, challenging full-stack projects,
                and interesting collaborations. Fill out the form and I'll get
                back to you as soon as possible.
              </p>

              <div className="flex items-center gap-5 pt-4">
                {[
                  { href: "https://github.com/chaditroudi", icon: <Github size={20} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={20} />, label: "LinkedIn" },
                  { href: `mailto:${EMAIL}`, icon: <Mail size={20} />, label: "Email" },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    whileHover={{ y: -3 }}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection delay={0.2} direction="right">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass rounded-3xl p-8 space-y-5"
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <User size={14} className="text-primary" /> Name
                </label>
                <input
                  id="name"
                  type="text"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
                    errors.name ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <Mail size={14} className="text-primary" /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
                    errors.email ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" /> Subject
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Project inquiry"
                  className="w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <Send size={14} className="text-primary" /> Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell me about your project…"
                  className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
                    errors.message ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:shadow-[0_0_40px_-5px_hsl(45_100%_60%/0.5)] transition-all duration-300"
              >
                <Send size={16} />
                Send Message
              </motion.button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
