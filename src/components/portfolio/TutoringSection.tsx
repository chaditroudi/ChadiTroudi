import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Code2, Users, Clock, CheckCircle2, BookOpen, Rocket,
  ArrowRight, Star, Zap, Trophy, Terminal, Coffee, Sparkles, ChevronDown,
  Play, Calendar, MapPin, Globe, MessageCircle, ExternalLink, Database,
  Cloud, Network, Monitor, Server, Shield, Wifi, HardDrive, Cpu,
  Layers, GitBranch, Container, Lock, FileCode, Settings, Radio,
  Cable, Router, Braces, Binary
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════
   BOOTCAMP DATA
   ═══════════════════════════════════════════════════ */

type BootcampTrack = {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  gradient: string;
  duration: string;
  level: string;
  description: string;
  modules: { title: string; desc: string; days: string; icon: any; color: string; lessons: number; projects: number; hours: number }[];
  schedule: { day: string; topic: string; detail: string }[];
  benefits: { icon: any; text: string; detail: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { name: string; text: string; avatar: string }[];
  stats: { value: string; label: string }[];
  codeSnippet: { lines: string[] };
  whatsappLink: string;
};

const bootcamps: BootcampTrack[] = [
  {
    id: "java",
    title: "Java + SQL",
    subtitle: "Full-Stack Fundamentals",
    icon: Coffee,
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-amber-500/20",
    duration: "10 Days",
    level: "Beginner",
    description: "From zero to building real Java applications with databases. Taught by engineers from Bonial & Yanyi Deutschland.",
    modules: [
      { title: "Java Fundamentals", desc: "OOP, Variables, Control Flow, Methods, Arrays & Strings", days: "Days 1–4", icon: Coffee, color: "from-orange-500/20 to-amber-500/20", lessons: 8, projects: 2, hours: 16 },
      { title: "Databases & SQL", desc: "PostgreSQL, CRUD, Joins, Indexing, JDBC integration", days: "Days 5–7", icon: Database, color: "from-blue-500/20 to-cyan-500/20", lessons: 5, projects: 1, hours: 12 },
      { title: "Final Project", desc: "Build & present a complete Java + Database application", days: "Days 8–10", icon: Trophy, color: "from-yellow-500/20 to-amber-500/20", lessons: 3, projects: 1, hours: 12 },
    ],
    schedule: [
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
    ],
    benefits: [
      { icon: Code2, text: "Hands-on coding daily", detail: "80% practice, 20% theory" },
      { icon: Users, text: "Small groups (max 8)", detail: "Personal attention guaranteed" },
      { icon: Clock, text: "10 intensive days", detail: "Focused accelerated learning" },
      { icon: BookOpen, text: "Real project", detail: "Build a complete Java app" },
      { icon: Rocket, text: "Career guidance", detail: "CV review & next steps" },
      { icon: CheckCircle2, text: "Certificate", detail: "Completion credential" },
    ],
    faqs: [
      { q: "Do I need prior programming experience?", a: "No! We start from absolute zero. Just bring your laptop and motivation." },
      { q: "What's the daily time commitment?", a: "Each day is about 4 hours of live sessions. Plan some extra time for practice exercises." },
      { q: "What will I be able to build after?", a: "A full Java application with database integration — a real portfolio piece for job applications." },
      { q: "What happens after I register?", a: "You'll join our WhatsApp group immediately, get the full schedule, and receive preparation materials." },
    ],
    testimonials: [
      { name: "Sarah M.", text: "Went from zero coding to understanding Java in just 10 days!", avatar: "SM" },
      { name: "Ahmed K.", text: "The hands-on approach made complex concepts click instantly.", avatar: "AK" },
      { name: "Lisa W.", text: "Best investment in my career. The mentorship was invaluable.", avatar: "LW" },
    ],
    stats: [
      { value: "95%", label: "Completion Rate" },
      { value: "4.9", label: "Student Rating" },
      { value: "50+", label: "Graduates" },
      { value: "10", label: "Days to Learn" },
    ],
    codeSnippet: {
      lines: [
        '<span class="text-purple-400">public class</span> <span class="text-primary">Student</span> {',
        '  <span class="text-purple-400">private</span> String name;',
        '  <span class="text-purple-400">public void</span> <span class="text-blue-400">learn</span>() {',
        '    skills.add(<span class="text-primary">"Java"</span>);',
        '    career.upgrade(); <span class="text-muted-foreground/50">// 🚀</span>',
        '  }',
        '}',
      ],
    },
    whatsappLink: "https://chat.whatsapp.com/GByjpxkbpkeABu5BKjQoxa",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    subtitle: "AWS · Docker · CI/CD",
    icon: Cloud,
    color: "text-sky-500",
    gradient: "from-sky-500/20 to-blue-500/20",
    duration: "12 Days",
    level: "Intermediate",
    description: "Master cloud infrastructure, containerization, and deployment pipelines. Learn to deploy, scale, and monitor real applications on AWS.",
    modules: [
      { title: "Cloud Foundations", desc: "AWS basics, EC2, S3, IAM, regions & availability zones", days: "Days 1–3", icon: Cloud, color: "from-sky-500/20 to-blue-500/20", lessons: 6, projects: 1, hours: 12 },
      { title: "Containers & Docker", desc: "Dockerfile, images, docker-compose, networking, volumes", days: "Days 4–6", icon: Container, color: "from-purple-500/20 to-indigo-500/20", lessons: 6, projects: 2, hours: 12 },
      { title: "CI/CD & Monitoring", desc: "GitHub Actions, deployment pipelines, CloudWatch, logging", days: "Days 7–9", icon: GitBranch, color: "from-green-500/20 to-emerald-500/20", lessons: 5, projects: 1, hours: 12 },
      { title: "Final Cloud Project", desc: "Deploy a full-stack app with Docker on AWS with CI/CD", days: "Days 10–12", icon: Rocket, color: "from-orange-500/20 to-amber-500/20", lessons: 4, projects: 1, hours: 12 },
    ],
    schedule: [
      { day: "Day 1", topic: "Cloud Computing Intro", detail: "What is cloud, AWS account setup, console tour" },
      { day: "Day 2", topic: "EC2 & Networking", detail: "Launch instances, security groups, SSH" },
      { day: "Day 3", topic: "S3, IAM & Permissions", detail: "Storage, user/role management, policies" },
      { day: "Day 4", topic: "Docker Fundamentals", detail: "Containers vs VMs, Dockerfile, build & run" },
      { day: "Day 5", topic: "Docker Compose", detail: "Multi-container apps, networking, volumes" },
      { day: "Day 6", topic: "Docker in Production", detail: "Optimization, security, registries" },
      { day: "Day 7", topic: "CI/CD Basics", detail: "GitHub Actions, automated testing" },
      { day: "Day 8", topic: "Deployment Pipelines", detail: "Build → Test → Deploy workflows" },
      { day: "Day 9", topic: "Monitoring & Logging", detail: "CloudWatch, alerts, log aggregation" },
      { day: "Day 10", topic: "Project Kickoff", detail: "Architecture, planning, infrastructure design" },
      { day: "Day 11", topic: "Project Build", detail: "Full implementation with mentor support" },
      { day: "Day 12", topic: "Demo Day ☁️", detail: "Present your deployed app & get certified" },
    ],
    benefits: [
      { icon: Cloud, text: "Real AWS environment", detail: "Hands-on with actual cloud services" },
      { icon: Container, text: "Docker mastery", detail: "Containerize any application" },
      { icon: GitBranch, text: "CI/CD pipelines", detail: "Automate your deployments" },
      { icon: Shield, text: "Security best practices", detail: "IAM, policies, secure configs" },
      { icon: Rocket, text: "Portfolio project", detail: "Live deployed cloud app" },
      { icon: CheckCircle2, text: "Cloud certificate", detail: "Validates your skills" },
    ],
    faqs: [
      { q: "Do I need coding experience?", a: "Basic programming knowledge is recommended. Familiarity with command line is helpful but not required." },
      { q: "Do I need an AWS account?", a: "We'll help you set up a free-tier account on Day 1. No credit card charges during the bootcamp." },
      { q: "Is Docker difficult to learn?", a: "Not with our approach! We break it down step-by-step with real examples. Most students get comfortable by Day 5." },
      { q: "What tools will we use?", a: "AWS Console & CLI, Docker Desktop, GitHub Actions, VS Code, and CloudWatch." },
    ],
    testimonials: [
      { name: "Marco D.", text: "Finally understand how cloud deployments work. Docker made so much sense!", avatar: "MD" },
      { name: "Fatima R.", text: "Deployed my first app to AWS on day 3. The pace was perfect.", avatar: "FR" },
      { name: "Tom B.", text: "The CI/CD section was a game-changer for my workflow.", avatar: "TB" },
    ],
    stats: [
      { value: "92%", label: "Completion Rate" },
      { value: "4.8", label: "Student Rating" },
      { value: "30+", label: "Graduates" },
      { value: "12", label: "Days to Deploy" },
    ],
    codeSnippet: {
      lines: [
        '<span class="text-blue-400">FROM</span> node:18-alpine',
        '<span class="text-blue-400">WORKDIR</span> /app',
        '<span class="text-blue-400">COPY</span> package*.json ./',
        '<span class="text-blue-400">RUN</span> npm ci --production',
        '<span class="text-blue-400">COPY</span> . .',
        '<span class="text-blue-400">EXPOSE</span> 3000',
        '<span class="text-blue-400">CMD</span> ["node", "server.js"]',
      ],
    },
    whatsappLink: "https://chat.whatsapp.com/GByjpxkbpkeABu5BKjQoxa",
  },
  {
    id: "networking",
    title: "Networking",
    subtitle: "TCP/IP · Protocols · Security",
    icon: Network,
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-teal-500/20",
    duration: "10 Days",
    level: "Beginner",
    description: "Understand how the internet works — from physical layers to application protocols. Master TCP/IP, DNS, HTTP, firewalls, and network security.",
    modules: [
      { title: "Network Fundamentals", desc: "OSI model, TCP/IP stack, IP addressing, subnetting", days: "Days 1–3", icon: Wifi, color: "from-emerald-500/20 to-teal-500/20", lessons: 6, projects: 1, hours: 12 },
      { title: "Protocols & Routing", desc: "DNS, DHCP, HTTP/HTTPS, routing tables, NAT", days: "Days 4–6", icon: Router, color: "from-blue-500/20 to-indigo-500/20", lessons: 6, projects: 1, hours: 12 },
      { title: "Security & Troubleshooting", desc: "Firewalls, VPN, Wireshark, tcpdump, network diagnostics", days: "Days 7–9", icon: Shield, color: "from-red-500/20 to-orange-500/20", lessons: 5, projects: 1, hours: 10 },
      { title: "Capstone Lab", desc: "Design & secure a complete network topology", days: "Day 10", icon: Trophy, color: "from-yellow-500/20 to-amber-500/20", lessons: 2, projects: 1, hours: 6 },
    ],
    schedule: [
      { day: "Day 1", topic: "How Networks Work", detail: "OSI layers, packets, Ethernet basics" },
      { day: "Day 2", topic: "IP Addressing", detail: "IPv4, IPv6, subnetting, CIDR notation" },
      { day: "Day 3", topic: "Switching & VLANs", detail: "L2 switching, VLANs, trunking" },
      { day: "Day 4", topic: "Routing Fundamentals", detail: "Static routes, RIP, OSPF basics" },
      { day: "Day 5", topic: "DNS & DHCP", detail: "Name resolution, dynamic addressing" },
      { day: "Day 6", topic: "HTTP, HTTPS & APIs", detail: "Web protocols, TLS, REST calls" },
      { day: "Day 7", topic: "Firewalls & ACLs", detail: "Packet filtering, stateful inspection" },
      { day: "Day 8", topic: "VPN & Encryption", detail: "IPSec, WireGuard, tunnel modes" },
      { day: "Day 9", topic: "Troubleshooting", detail: "Wireshark, ping, traceroute, netstat" },
      { day: "Day 10", topic: "Capstone Lab 🌐", detail: "Design, build & secure a network" },
    ],
    benefits: [
      { icon: Wifi, text: "Hands-on labs", detail: "Real network simulations" },
      { icon: Shield, text: "Security focus", detail: "Firewalls, VPNs, encryption" },
      { icon: Users, text: "Small groups (max 8)", detail: "Guided lab exercises" },
      { icon: Monitor, text: "Wireshark skills", detail: "Packet analysis mastery" },
      { icon: Rocket, text: "Career-ready", detail: "Prep for CompTIA Network+" },
      { icon: CheckCircle2, text: "Certificate", detail: "Completion credential" },
    ],
    faqs: [
      { q: "Do I need networking experience?", a: "No! We cover everything from the ground up — starting with what a network actually is." },
      { q: "What software do we use?", a: "Wireshark, Packet Tracer (or GNS3), terminal tools like ping/traceroute, and a Linux VM." },
      { q: "Will this help with certifications?", a: "Yes! The curriculum aligns closely with CompTIA Network+ and CCNA fundamentals." },
      { q: "Is this theoretical or practical?", a: "70% hands-on labs, 30% theory. You'll build and troubleshoot real network setups." },
    ],
    testimonials: [
      { name: "Yuki T.", text: "Subnetting finally clicked on day 2. The labs are amazing!", avatar: "YT" },
      { name: "David L.", text: "Wireshark was intimidating at first, but now I use it daily at work.", avatar: "DL" },
      { name: "Amara N.", text: "Passed my Network+ exam two weeks after this bootcamp!", avatar: "AN" },
    ],
    stats: [
      { value: "90%", label: "Completion Rate" },
      { value: "4.8", label: "Student Rating" },
      { value: "25+", label: "Graduates" },
      { value: "10", label: "Days to Master" },
    ],
    codeSnippet: {
      lines: [
        '<span class="text-green-400">$</span> ip addr show eth0',
        '  inet <span class="text-primary">192.168.1.42/24</span>',
        '<span class="text-green-400">$</span> ping -c 3 google.com',
        '  64 bytes: ttl=117 time=<span class="text-primary">12.3ms</span>',
        '<span class="text-green-400">$</span> traceroute 8.8.8.8',
        '  1  gateway  <span class="text-primary">1.2ms</span>',
        '  2  isp-node <span class="text-primary">8.5ms</span>',
      ],
    },
    whatsappLink: "https://chat.whatsapp.com/GByjpxkbpkeABu5BKjQoxa",
  },
  {
    id: "os",
    title: "Operating Systems",
    subtitle: "Linux · Processes · Systems",
    icon: Monitor,
    color: "text-violet-500",
    gradient: "from-violet-500/20 to-purple-500/20",
    duration: "10 Days",
    level: "Beginner",
    description: "Deep-dive into how operating systems work — processes, memory, filesystems, and shell scripting. Master Linux from the terminal up.",
    modules: [
      { title: "Linux & Shell Basics", desc: "Terminal, filesystem, permissions, Bash scripting", days: "Days 1–3", icon: Terminal, color: "from-violet-500/20 to-purple-500/20", lessons: 6, projects: 1, hours: 12 },
      { title: "Processes & Memory", desc: "Process management, scheduling, virtual memory, swap", days: "Days 4–6", icon: Cpu, color: "from-pink-500/20 to-rose-500/20", lessons: 6, projects: 1, hours: 12 },
      { title: "Storage & Networking", desc: "Filesystems, disk management, systemd, networking basics", days: "Days 7–9", icon: HardDrive, color: "from-cyan-500/20 to-sky-500/20", lessons: 5, projects: 1, hours: 10 },
      { title: "Capstone: Build a Server", desc: "Configure a Linux server from scratch with services", days: "Day 10", icon: Server, color: "from-yellow-500/20 to-amber-500/20", lessons: 2, projects: 1, hours: 6 },
    ],
    schedule: [
      { day: "Day 1", topic: "What is an OS?", detail: "Kernel, userspace, booting, distributions" },
      { day: "Day 2", topic: "Terminal & Filesystem", detail: "Bash, navigation, permissions, pipes" },
      { day: "Day 3", topic: "Shell Scripting", detail: "Variables, loops, functions, automation" },
      { day: "Day 4", topic: "Processes", detail: "PID, fork, exec, signals, ps, top, htop" },
      { day: "Day 5", topic: "Scheduling & Cron", detail: "CPU scheduling, crontab, systemd timers" },
      { day: "Day 6", topic: "Memory Management", detail: "Virtual memory, paging, swap, OOM killer" },
      { day: "Day 7", topic: "Filesystems & Disks", detail: "ext4, mount, fdisk, LVM basics" },
      { day: "Day 8", topic: "Users & Security", detail: "Users, groups, sudo, SSH, firewall" },
      { day: "Day 9", topic: "Services & Networking", detail: "systemd, journalctl, network config" },
      { day: "Day 10", topic: "Server Build Day 🖥️", detail: "Full Linux server with web + DB services" },
    ],
    benefits: [
      { icon: Terminal, text: "Terminal mastery", detail: "Command line confidence" },
      { icon: Cpu, text: "System internals", detail: "Understand how it all works" },
      { icon: Users, text: "Small groups (max 8)", detail: "Guided hands-on labs" },
      { icon: FileCode, text: "Bash scripting", detail: "Automate everything" },
      { icon: Rocket, text: "Server skills", detail: "Real sysadmin experience" },
      { icon: CheckCircle2, text: "Certificate", detail: "Completion credential" },
    ],
    faqs: [
      { q: "Do I need Linux installed?", a: "We'll set up a virtual machine together on Day 1. Works on Windows, Mac, or Linux." },
      { q: "Is this for developers or sysadmins?", a: "Both! Understanding OS internals makes you a better developer and a stronger engineer." },
      { q: "Which Linux distribution?", a: "We use Ubuntu Server — the most popular choice for servers and a great learning platform." },
      { q: "Will I learn enough for a job?", a: "You'll cover the core knowledge needed for junior sysadmin or DevOps roles." },
    ],
    testimonials: [
      { name: "Chris P.", text: "Finally feel comfortable in the terminal. Bash scripting is now my superpower!", avatar: "CP" },
      { name: "Nadia K.", text: "The process management section was eye-opening. I understand htop now!", avatar: "NK" },
      { name: "James O.", text: "Set up my own VPS after this bootcamp. Couldn't have done it without this course.", avatar: "JO" },
    ],
    stats: [
      { value: "93%", label: "Completion Rate" },
      { value: "4.9", label: "Student Rating" },
      { value: "35+", label: "Graduates" },
      { value: "10", label: "Days to Master" },
    ],
    codeSnippet: {
      lines: [
        '<span class="text-green-400">$</span> ps aux | grep node',
        '  <span class="text-primary">1234</span>  0.5% node server.js',
        '<span class="text-green-400">$</span> chmod 755 deploy.sh',
        '<span class="text-green-400">$</span> ./deploy.sh',
        '  <span class="text-primary">✓</span> Building...',
        '  <span class="text-primary">✓</span> Deploying...',
        '  <span class="text-primary">✓</span> Server running on :3000',
      ],
    },
    whatsappLink: "https://chat.whatsapp.com/GByjpxkbpkeABu5BKjQoxa",
  },
];

/* ═══════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════ */

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

const CodeSnippetBlock = ({ lines }: { lines: string[] }) => (
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
        {lines.map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

const TutoringSection = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState("java");
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

  const track = bootcamps.find(b => b.id === activeTrack)!;

  // Reset UI when switching tracks
  useEffect(() => {
    setExpandedModule(null);
    setExpandedFaq(null);
    setShowSchedule(false);
    setSubmitted(false);
    setFormStep(1);
  }, [activeTrack]);

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
      motivation: `[${track.title}] ${form.motivation.trim() || "N/A"}`,
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Registration failed", description: "Please try again later.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Registration successful! 🎉", description: `Welcome to ${track.title}!` });
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
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              Tech Academy — 4 Tracks Available
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold font-display text-foreground mb-5 leading-tight">
              Master
              <span className="relative mx-3">
                <span className="text-gradient">Tech Skills</span>
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
              With Intensive Bootcamps
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Hands-on, mentor-led bootcamps designed to take you from beginner to job-ready. Choose your path.
            </p>
          </div>
        </AnimatedSection>

        {/* Track Selector Tabs */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {bootcamps.map((b) => {
              const Icon = b.icon;
              const isActive = activeTrack === b.id;
              return (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTrack(b.id)}
                  className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 group ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary/20" : "bg-muted/20 group-hover:bg-primary/10"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {b.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.duration} · {b.level}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="track-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Active Track Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Track Header */}
            <AnimatedSection>
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">
                  Learn <span className="text-gradient">{track.title}</span> in {track.duration}
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-3">{track.description}</p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Berlin / Remote</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {track.duration} Intensive</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> EN / DE / FR</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto py-8 px-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40">
                {track.stats.map((s, i) => (
                  <Counter key={`${track.id}-${i}`} value={s.value} label={s.label} />
                ))}
              </div>
            </AnimatedSection>

            {/* Benefits */}
            <AnimatedSection delay={0.15}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20 max-w-4xl mx-auto">
                {track.benefits.map((b, i) => (
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
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    {track.modules.length} Modules — {track.duration}
                  </h3>
                </div>
                <div className="space-y-3 relative">
                  <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
                  {track.modules.map((mod, i) => (
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
                        {track.schedule.map((day, i) => (
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
                  <CodeSnippetBlock lines={track.codeSnippet.lines} />
                  <div className="glass rounded-3xl p-8 border border-border/50 shadow-2xl">
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Only <strong>{spotsLeft} spots</strong> remaining for {track.title}!</span>
                    </motion.div>

                    <h3 className="text-2xl font-bold font-display text-foreground mb-1">Register for {track.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6">Join {track.stats[2]?.value || "our"} successful graduates</p>

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
                        <p className="text-muted-foreground mb-6">Welcome to the {track.title} bootcamp!</p>

                        <div className="text-left space-y-4 mb-8">
                          {[
                            { step: 1, title: "Join the WhatsApp Group", desc: "Connect with your classmates & instructor" },
                            { step: 2, title: "Get Your Schedule & Materials", desc: `${track.duration} plan, setup guide & pre-course reading` },
                            { step: 3, title: "Prepare Your Setup", desc: "Installation guides will be shared in the group" },
                          ].map((s, i) => (
                            <motion.div
                              key={s.step}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.2 }}
                              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
                            >
                              <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{s.step}</span>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                                <p className="text-xs text-muted-foreground">{s.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <Button
                            className="w-full h-12 rounded-xl group text-base bg-[#25D366] hover:bg-[#20bd5a] text-white"
                            onClick={() => window.open(track.whatsappLink, "_blank")}
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
                            View Full Schedule
                          </Button>
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
                                      { value: "beginner", label: "🌱 Beginner", desc: "No prior experience" },
                                      { value: "some_experience", label: "📚 Some Experience", desc: "Basic knowledge" },
                                      { value: "intermediate", label: "⚡ Intermediate", desc: `Familiar with ${track.title}` },
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
                                  <textarea id="motivation" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} placeholder={`I want to learn ${track.title} to...`} maxLength={500} rows={3} className="mt-1.5 flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
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
                  {track.testimonials.map((t, i) => (
                    <motion.div
                      key={`${track.id}-${i}`}
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
                  {track.faqs.map((faq, i) => (
                    <motion.div
                      key={`${track.id}-faq-${i}`}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TutoringSection;
