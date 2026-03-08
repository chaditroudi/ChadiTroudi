import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Code2, Users, Clock, CheckCircle2, BookOpen, Rocket,
  ArrowRight, Star, Zap, Trophy, Terminal, Coffee, Sparkles, ChevronDown,
  Play, Calendar, MapPin, Globe, MessageCircle, ExternalLink, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const modules = [
  {
    title: "Java Fundamentals",
    desc: "OOP, Variables, Control Flow, Methods, Arrays & Strings",
    days: "Days 1–4",
    icon: Coffee,
    color: "from-orange-500/20 to-amber-500/20",
    lessons: 8,
    projects: 2,
    hours: 16,
  },
  {
    title: "Databases & SQL",
    desc: "PostgreSQL, CRUD, Joins, Indexing, JDBC integration",
    days: "Days 5–7",
    icon: Database,
    color: "from-blue-500/20 to-cyan-500/20",
    lessons: 5,
    projects: 1,
    hours: 12,
  },
  {
    title: "Final Project",
    desc: "Build & present a complete Java + Database application",
    days: "Days 8–10",
    icon: Trophy,
    color: "from-yellow-500/20 to-amber-500/20",
    lessons: 3,
    projects: 1,
    hours: 12,
  },
];

const schedule = [
  { day: "Day 1", topic: "Setup & Java Basics", detail: "JDK, IDE, variables, types, operators" },
  { day: "Day 2", topic: "Control Flow & Methods", detail: "If/else, loops, functions, scope" },
  { day: "Day 3", topic: "OOP Essentials", detail: "Classes, objects, inheritance, polymorphism" },
  { day: "Day 4", topic: "Collections & Strings", detail: "ArrayList, HashMap, String manipulation" },
  { day: "Day 5", topic: "SQL Fundamentals", detail: "PostgreSQL setup, CREATE, INSERT, SELECT" },
  { day: "Day 6", topic: "Advanced SQL", detail: "JOINs, GROUP BY, indexes, optimization" },
  { day: "Day 7", topic: "Java + Database", detail: "JDBC, connecting Java to PostgreSQL" },
  { day: "Day 8", topic: "Project Kickoff", detail: "Architecture, planning, database design" },
  { day: "Day 9", topic: "Project Build", detail: "Full implementation with mentor support" },
  { day: "Day 10", topic: "Demo Day 🎉", detail: "Present your project & receive certificate" },
];

const benefits = [
  { icon: Code2, text: "Hands-on coding daily", detail: "80% practice, 20% theory" },
  { icon: Users, text: "Small groups (max 8)", detail: "Personal attention guaranteed" },
  { icon: Clock, text: "10 intensive days", detail: "Focused accelerated learning" },
  { icon: BookOpen, text: "Real project", detail: "Build a complete Java app" },
  { icon: Rocket, text: "Career guidance", detail: "CV review & next steps" },
  { icon: CheckCircle2, text: "Certificate", detail: "Completion credential" },
];

const testimonialStudents = [
  { name: "Sarah M.", text: "Went from zero coding to understanding Java in just 10 days!", avatar: "SM" },
  { name: "Ahmed K.", text: "The hands-on approach made complex concepts click instantly.", avatar: "AK" },
  { name: "Lisa W.", text: "Best investment in my career. The mentorship was invaluable.", avatar: "LW" },
];

const stats = [
  { value: "95%", label: "Completion Rate" },
  { value: "4.9", label: "Student Rating" },
  { value: "50+", label: "Graduates" },
  { value: "10", label: "Days to Learn" },
];

const faqs = [
  { q: "Do I need prior programming experience?", a: "No! We start from absolute zero. Just bring your laptop and motivation." },
  { q: "What's the daily time commitment?", a: "Each day is about 4 hours of live sessions. Plan some extra time for practice exercises." },
  { q: "What will I be able to build after?", a: "A full Java application with database integration — a real portfolio piece for job applications." },
  { q: "What happens after I register?", a: "You'll join our WhatsApp group immediately, get the full schedule, and receive preparation materials to get a head start." },
];

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/GByjpxkbpkeABu5BKjQoxa";

// Floating code snippet decoration
const CodeSnippet = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="absolute -top-6 -right-6 hidden xl:block"
  >
    <div className="bg-foreground/5 backdrop-blur-xl border border-border/30 rounded-xl p-4 font-mono text-xs shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
      </div>
      <div className="space-y-1 text-muted-foreground">
        <div><span className="text-purple-400">public class</span> <span className="text-primary">Student</span> {"{"}</div>
        <div className="pl-4"><span className="text-purple-400">private</span> String name;</div>
        <div className="pl-4 mt-2"><span className="text-purple-400">public void</span> <span className="text-blue-400">learn</span>() {"{"}</div>
        <div className="pl-8">skills.add(<span className="text-primary">"Java"</span>);</div>
        <div className="pl-8">career.upgrade(); <span className="text-muted-foreground/50">// 🚀</span></div>
        <div className="pl-4">{"}"}</div>
        <div>{"}"}</div>
      </div>
    </div>
  </motion.div>
);

// Animated counter
const Counter = ({ value, label }: { value: string; label: string }) => {
  const [display, setDisplay] = useState("0");
  const numericPart = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    const target = parseFloat(numericPart);
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(target % 1 === 0 ? Math.round(current).toString() : current.toFixed(1));
      if (progress >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [numericPart]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold font-display text-primary">{display}{suffix}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

// Form step indicator
const FormStep = ({ step, currentStep, label }: { step: number; currentStep: number; label: string }) => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{
        backgroundColor: currentStep >= step ? "hsl(var(--primary))" : "hsl(var(--muted)/0.3)",
        scale: currentStep === step ? 1.1 : 1,
      }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
    >
      {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
    </motion.div>
    <span className={`text-sm font-medium ${currentStep >= step ? "text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
  </div>
);

const TutoringSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [spotsLeft] = useState(3);
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
      toast({ title: "Registration successful! 🎉", description: "Welcome aboard!" });
    }
  };

  const canProceed = formStep === 1 ? form.full_name.trim() && form.email.trim() : true;

  return (
    <section id="tutoring" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-background" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px]" />

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              10-Day Intensive Bootcamp
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                {spotsLeft} spots left
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold font-display text-foreground mb-5 leading-tight">
              Learn
              <span className="relative mx-3">
                <span className="text-gradient">Java + SQL</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.path
                    d="M 0 4 Q 50 0 100 4 Q 150 8 200 4"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              <br className="hidden md:block" />
              in 10 Days
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-3">
              From zero to building real Java applications with databases.
              Taught by engineers from <strong className="text-foreground">Bonial</strong> & <strong className="text-foreground">Yanyi Deutschland</strong>.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Berlin / Remote</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 10 Days Intensive</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> EN / DE / FR</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto py-8 px-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40">
            {stats.map((s, i) => (
              <Counter key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">{b.text}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{b.detail}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Curriculum + Registration */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Curriculum */}
          <AnimatedSection direction="left" delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-display text-foreground">3 Modules — 10 Days</h3>
            </div>
            <div className="space-y-3 relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
              {modules.map((mod, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                  className="relative cursor-pointer"
                >
                  <motion.div
                    layout
                    className={`flex gap-4 p-4 rounded-2xl bg-gradient-to-r ${mod.color} border border-border/50 hover:border-primary/30 transition-all duration-300 ${expandedModule === i ? 'border-primary/40 shadow-lg' : ''}`}
                  >
                    <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-card border border-border/60 text-primary shrink-0">
                      <mod.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{mod.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full">{mod.days}</span>
                          <motion.div animate={{ rotate: expandedModule === i ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{mod.desc}</p>
                      <AnimatePresence>
                        {expandedModule === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mod.hours}h</span>
                              <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> {mod.projects} project{mod.projects > 1 ? 's' : ''}</span>
                              <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {mod.lessons} lessons</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Day-by-day toggle */}
            <motion.button
              onClick={() => setShowSchedule(!showSchedule)}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {showSchedule ? "Hide" : "View"} day-by-day schedule
              <motion.div animate={{ rotate: showSchedule ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showSchedule && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-2">
                    {schedule.map((day, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/30"
                      >
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0 min-w-[52px] text-center">
                          {day.day}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground">{day.topic}</span>
                          <span className="text-xs text-muted-foreground block mt-0.5">{day.detail}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedSection>

          {/* Registration Form */}
          <AnimatedSection direction="right" delay={0.3}>
            <div className="relative">
              <CodeSnippet />
              <div className="glass rounded-3xl p-8 border border-border/50 shadow-2xl">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                >
                  <Zap className="w-4 h-4" />
                  <span>Only <strong>{spotsLeft} spots</strong> remaining!</span>
                </motion.div>

                <h3 className="text-2xl font-bold font-display text-foreground mb-1">Register Now</h3>
                <p className="text-muted-foreground text-sm mb-6">Join 50+ successful graduates</p>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center py-6"
                  >
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                    </motion.div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">You're In, {form.full_name.split(" ")[0]}! 🎉</h4>
                    <p className="text-muted-foreground mb-6">Here's what happens next:</p>

                    {/* Post-registration steps */}
                    <div className="text-left space-y-4 mb-8">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
                      >
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">1</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Join the WhatsApp Group</p>
                          <p className="text-xs text-muted-foreground">Connect with your classmates & instructor</p>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
                      >
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">2</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Get Your Schedule & Materials</p>
                          <p className="text-xs text-muted-foreground">10-day plan, setup guide & pre-course reading</p>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
                      >
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">3</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Prepare Your Laptop</p>
                          <p className="text-xs text-muted-foreground">Install JDK, IntelliJ IDEA & PostgreSQL (guides provided)</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12 rounded-xl group text-base bg-[#25D366] hover:bg-[#20bd5a] text-white"
                        onClick={() => window.open(WHATSAPP_GROUP_LINK, "_blank")}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Join WhatsApp Group
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl"
                        onClick={() => {
                          setShowSchedule(true);
                          document.getElementById("tutoring")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <Calendar className="w-4 h-4" />
                        View Full 10-Day Schedule
                      </Button>
                    </div>

                    {/* Materials preview */}
                    <div className="mt-6 p-4 rounded-xl bg-accent/30 border border-border/30">
                      <h5 className="text-sm font-semibold text-foreground mb-2">📦 Your Pre-Course Materials</h5>
                      <ul className="text-xs text-muted-foreground space-y-1.5 text-left">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> JDK & IDE Setup Guide (PDF)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> PostgreSQL Installation Guide</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> Java Cheat Sheet for Beginners</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> Day-by-Day Schedule & Syllabus</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3 italic">All materials will be shared in the WhatsApp group</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <FormStep step={1} currentStep={formStep} label="Details" />
                      <div className="flex-1 h-px bg-border mx-3" />
                      <FormStep step={2} currentStep={formStep} label="Goals" />
                    </div>

                    <form onSubmit={handleSubmit}>
                      <AnimatePresence mode="wait">
                        {formStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                          >
                            <div>
                              <Label htmlFor="full_name" className="text-sm font-medium">Full Name *</Label>
                              <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your full name" required maxLength={100} className="mt-1.5 h-12 rounded-xl" />
                            </div>
                            <div>
                              <Label htmlFor="reg_email" className="text-sm font-medium">Email *</Label>
                              <Input id="reg_email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required maxLength={255} className="mt-1.5 h-12 rounded-xl" />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></Label>
                              <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+49 ..." maxLength={20} className="mt-1.5 h-12 rounded-xl" />
                            </div>
                            <Button type="button" className="w-full h-12 rounded-xl group text-base" disabled={!canProceed} onClick={() => setFormStep(2)}>
                              Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        )}
                        {formStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div>
                              <Label className="text-sm font-medium">Experience Level</Label>
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                {[
                                  { value: "beginner", label: "🌱 Beginner", desc: "No coding experience" },
                                  { value: "some_experience", label: "📚 Some Experience", desc: "Basic programming" },
                                  { value: "intermediate", label: "⚡ Intermediate", desc: "Familiar with Java" },
                                ].map((opt) => (
                                  <motion.button
                                    key={opt.value}
                                    type="button"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setForm({ ...form, experience_level: opt.value })}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${form.experience_level === opt.value ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 hover:border-primary/30"}`}
                                  >
                                    <span className="text-lg">{opt.label.split(" ")[0]}</span>
                                    <div>
                                      <div className="text-sm font-medium text-foreground">{opt.label.split(" ").slice(1).join(" ")}</div>
                                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="motivation" className="text-sm font-medium">What are your goals? <span className="text-muted-foreground">(optional)</span></Label>
                              <textarea id="motivation" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} placeholder="I want to learn Java to..." maxLength={500} rows={3} className="mt-1.5 flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                            </div>
                            <div className="flex gap-3">
                              <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => setFormStep(1)}>Back</Button>
                              <Button type="submit" className="flex-1 h-12 rounded-xl group text-base" disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                    <Zap className="w-4 h-4" />
                                  </motion.div>
                                ) : (
                                  <>Secure My Spot <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /></>
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-xs text-muted-foreground text-center mt-4">🔒 Free to register • No payment required</p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Student testimonials */}
        <AnimatedSection delay={0.2}>
          <div className="mb-20">
            <h3 className="text-2xl font-bold font-display text-foreground text-center mb-8">What Students Say</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonialStudents.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                    <span className="text-sm font-medium text-foreground">{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection delay={0.25}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold font-display text-foreground text-center mb-8">
              <MessageCircle className="w-6 h-6 inline-block mr-2 text-primary" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  layout
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between p-5">
                    <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                    <motion.div animate={{ rotate: expandedFaq === i ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TutoringSection;
