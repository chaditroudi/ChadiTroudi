import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Code2, Users, Clock, CheckCircle2, BookOpen, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const modules = [
  { title: "Java Fundamentals", desc: "OOP, Collections, Generics, Streams", weeks: "Weeks 1-3" },
  { title: "Spring Boot & REST APIs", desc: "Build production-ready microservices", weeks: "Weeks 4-6" },
  { title: "Databases & JPA", desc: "PostgreSQL, Hibernate, query optimization", weeks: "Weeks 7-8" },
  { title: "Testing & CI/CD", desc: "JUnit, Mockito, Docker, GitHub Actions", weeks: "Weeks 9-10" },
  { title: "Cloud & Deployment", desc: "AWS, Kubernetes basics, monitoring", weeks: "Weeks 11-12" },
  { title: "Final Project", desc: "Build & deploy a full-stack application", weeks: "Weeks 13-14" },
];

const benefits = [
  { icon: Code2, text: "Hands-on coding every session" },
  { icon: Users, text: "Small groups (max 8 students)" },
  { icon: Clock, text: "Flexible evening & weekend slots" },
  { icon: BookOpen, text: "Real-world project portfolio" },
  { icon: Rocket, text: "Career guidance & CV review" },
  { icon: CheckCircle2, text: "Certificate of completion" },
];

const TutoringSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    experience_level: "beginner",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("formation_registrations").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      experience_level: form.experience_level,
      motivation: form.motivation.trim() || null,
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Registration failed", description: "Please try again later.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Registration successful! 🎉", description: "We'll contact you with next steps." });
    }
  };

  return (
    <section id="tutoring" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              Formation Program
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
              Java Development <span className="text-gradient">Bootcamp</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              14-week intensive program to take you from zero to job-ready Java developer.
              Learn from real-world industry experience at companies like Bonial & Yanyi Deutschland.
            </p>
          </div>
        </AnimatedSection>

        {/* Benefits grid */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-sm"
              >
                <b.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Curriculum + Registration */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Curriculum */}
          <AnimatedSection direction="left" delay={0.2}>
            <h3 className="text-2xl font-bold font-display text-foreground mb-6">Curriculum</h3>
            <div className="space-y-3">
              {modules.map((mod, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{mod.title}</h4>
                      <span className="text-xs text-muted-foreground">{mod.weeks}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{mod.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Registration Form */}
          <AnimatedSection direction="right" delay={0.3}>
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold font-display text-foreground mb-2">Register Now</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Secure your spot — next cohort starts soon!
              </p>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">You're Registered!</h4>
                  <p className="text-muted-foreground">We'll reach out to {form.email} with all the details.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Your full name"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg_email">Email *</Label>
                    <Input
                      id="reg_email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+49 ..."
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Experience Level</Label>
                    <select
                      id="level"
                      value={form.experience_level}
                      onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="beginner">Beginner — No coding experience</option>
                      <option value="some_experience">Some Experience — Basic programming</option>
                      <option value="intermediate">Intermediate — Familiar with Java</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="motivation">Why do you want to learn Java? (optional)</Label>
                    <textarea
                      id="motivation"
                      value={form.motivation}
                      onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                      placeholder="Tell us about your goals..."
                      maxLength={500}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full group" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : (
                      <>
                        Register for the Bootcamp
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Free to register • No commitment required</p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default TutoringSection;
