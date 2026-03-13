import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BookOpen, Upload, FileText, Video, Mic, Presentation,
  Sparkles, Languages, Smartphone, CheckCircle2, Clock,
  ChevronRight, Plus, Trash2, GripVertical, Eye, Download,
  Settings2, Users, Brain, Layers, Globe, Shield,
  BarChart3, Zap, ArrowRight, Play, Pause, RotateCcw,
  FolderOpen, FileUp, Search, Filter, Star, Edit3,
  Monitor, Tablet, Phone, Award, Target, TrendingUp,
  AlertCircle, Info, X, Check, Loader2, PanelLeftClose,
  PanelLeftOpen, Wand2,
} from "lucide-react";

// ─── Types ───
interface UploadedFile {
  id: string;
  name: string;
  type: "document" | "presentation" | "audio" | "video";
  size: string;
  status: "uploading" | "processing" | "analyzed" | "error";
  progress: number;
  concepts: string[];
}

interface GeneratedModule {
  id: string;
  title: string;
  duration: string;
  lessons: GeneratedLesson[];
  status: "draft" | "reviewed" | "published";
}

interface GeneratedLesson {
  id: string;
  title: string;
  type: "text" | "interactive" | "quiz" | "video" | "exercise";
  duration: string;
  content: string;
  expanded?: boolean;
}

interface CourseConfig {
  title: string;
  targetRole: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  outputFormat: "scorm" | "xapi" | "html5";
  mobileResponsive: boolean;
  brandColor: string;
}

// ─── Mock Data ───
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
];

const TARGET_ROLES = [
  "Software Engineer", "Data Analyst", "Project Manager", "Sales Representative",
  "Customer Support", "Marketing Specialist", "HR Manager", "Finance Analyst",
  "DevOps Engineer", "Product Manager", "All Employees", "New Hires",
];

const SAMPLE_MODULES: GeneratedModule[] = [
  {
    id: "m1",
    title: "Module 1: Introduction & Core Concepts",
    duration: "25 min",
    status: "reviewed",
    lessons: [
      { id: "l1", title: "Welcome & Course Overview", type: "text", duration: "3 min", content: "This introductory lesson provides an overview of the course objectives, expected outcomes, and how to navigate through the learning materials effectively." },
      { id: "l2", title: "Key Terminology & Definitions", type: "interactive", duration: "8 min", content: "Interactive glossary with drag-and-drop matching exercises. Terms are extracted from your uploaded documents using AI content analysis." },
      { id: "l3", title: "Foundational Principles", type: "text", duration: "10 min", content: "Core principles identified from your source materials, restructured into a clear learning progression with visual diagrams." },
      { id: "l4", title: "Knowledge Check: Basics", type: "quiz", duration: "4 min", content: "5 auto-generated multiple choice questions testing comprehension of Module 1 concepts. Adaptive difficulty based on learner responses." },
    ],
  },
  {
    id: "m2",
    title: "Module 2: Practical Application",
    duration: "35 min",
    status: "draft",
    lessons: [
      { id: "l5", title: "Real-World Scenarios", type: "interactive", duration: "12 min", content: "Branching scenario exercises derived from case studies in your uploaded materials. Learners make decisions and see consequences." },
      { id: "l6", title: "Step-by-Step Walkthrough", type: "video", duration: "8 min", content: "AI-generated narrated walkthrough from your presentation slides. Auto-synced subtitles in the selected language." },
      { id: "l7", title: "Hands-On Exercise", type: "exercise", duration: "10 min", content: "Practice exercise with embedded workspace. Learners apply concepts from the module in a guided environment." },
      { id: "l8", title: "Module Assessment", type: "quiz", duration: "5 min", content: "Comprehensive assessment covering practical application topics. Includes scenario-based questions and code challenges." },
    ],
  },
  {
    id: "m3",
    title: "Module 3: Advanced Topics & Best Practices",
    duration: "30 min",
    status: "draft",
    lessons: [
      { id: "l9", title: "Advanced Strategies", type: "text", duration: "10 min", content: "Deep dive into advanced concepts extracted from expert-level content in your source materials." },
      { id: "l10", title: "Common Pitfalls & Solutions", type: "interactive", duration: "8 min", content: "Interactive troubleshooting guide. AI-identified common mistakes from your training materials with guided fixes." },
      { id: "l11", title: "Best Practices Summary", type: "text", duration: "5 min", content: "Consolidated best practices across all uploaded sources, organized by topic with actionable checklists." },
      { id: "l12", title: "Final Certification Exam", type: "quiz", duration: "7 min", content: "Comprehensive final exam covering all modules. Pass rate: 80%. Certificate of completion awarded." },
    ],
  },
];

const FILE_TYPE_ICONS: Record<string, typeof FileText> = {
  document: FileText,
  presentation: Presentation,
  audio: Mic,
  video: Video,
};

const LESSON_TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  text: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Reading" },
  interactive: { bg: "bg-purple-500/10", text: "text-purple-500", label: "Interactive" },
  quiz: { bg: "bg-orange-500/10", text: "text-orange-500", label: "Quiz" },
  video: { bg: "bg-red-500/10", text: "text-red-500", label: "Video" },
  exercise: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Exercise" },
};

// ─── Component ───
const AI4ELearning = () => {
  const [activeStep, setActiveStep] = useState<"upload" | "configure" | "generate" | "preview">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedModules, setGeneratedModules] = useState<GeneratedModule[]>([]);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(["en"]);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["m1"]));
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [searchCourses, setSearchCourses] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<CourseConfig>({
    title: "",
    targetRole: "All Employees",
    language: "en",
    difficulty: "intermediate",
    outputFormat: "scorm",
    mobileResponsive: true,
    brandColor: "#6366f1",
  });

  // Simulate file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const typeMap: Record<string, UploadedFile["type"]> = {
      pdf: "document", doc: "document", docx: "document", txt: "document",
      ppt: "presentation", pptx: "presentation", key: "presentation",
      mp3: "audio", wav: "audio", m4a: "audio",
      mp4: "video", mov: "video", avi: "video", webm: "video",
    };

    const newFiles: UploadedFile[] = Array.from(files).map((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      return {
        id: crypto.randomUUID(),
        name: f.name,
        type: typeMap[ext] || "document",
        size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
        status: "uploading",
        progress: 0,
        concepts: [],
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload + analysis
    newFiles.forEach((file) => {
      let p = 0;
      const uploadInterval = setInterval(() => {
        p += Math.random() * 20 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(uploadInterval);
          setUploadedFiles((prev) =>
            prev.map((f) => f.id === file.id ? { ...f, progress: 100, status: "processing" } : f)
          );
          // Simulate analysis
          setTimeout(() => {
            const sampleConcepts = [
              ["API Design", "REST Principles", "Authentication"],
              ["Data Modeling", "Query Optimization", "Indexing"],
              ["Agile Methodology", "Sprint Planning", "Retrospectives"],
              ["Customer Journey", "Engagement", "Retention"],
              ["Risk Assessment", "Compliance", "Reporting"],
            ];
            setUploadedFiles((prev) =>
              prev.map((f) => f.id === file.id ? {
                ...f,
                status: "analyzed",
                concepts: sampleConcepts[Math.floor(Math.random() * sampleConcepts.length)],
              } : f)
            );
          }, 1500);
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => f.id === file.id ? { ...f, progress: Math.min(p, 100) } : f)
          );
        }
      }, 200);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const allFilesAnalyzed = uploadedFiles.length > 0 && uploadedFiles.every((f) => f.status === "analyzed");

  // Simulate course generation
  const generateCourse = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveStep("generate");

    const steps = [
      { progress: 15, delay: 800 },
      { progress: 35, delay: 1200 },
      { progress: 55, delay: 1000 },
      { progress: 75, delay: 1400 },
      { progress: 90, delay: 800 },
      { progress: 100, delay: 600 },
    ];

    let i = 0;
    const runStep = () => {
      if (i >= steps.length) {
        setIsGenerating(false);
        setGeneratedModules(SAMPLE_MODULES);
        setActiveStep("preview");
        return;
      }
      setTimeout(() => {
        setGenerationProgress(steps[i].progress);
        i++;
        runStep();
      }, steps[i].delay);
    };
    runStep();
  };

  const toggleTranslation = (code: string) => {
    setSelectedTranslations((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleModuleExpand = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalLessons = generatedModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = generatedModules.reduce((sum, m) => sum + parseInt(m.duration), 0);

  const GENERATION_STEPS = [
    { label: "Analyzing content", icon: Brain, threshold: 15 },
    { label: "Extracting key concepts", icon: Search, threshold: 35 },
    { label: "Structuring curriculum", icon: Layers, threshold: 55 },
    { label: "Generating lessons", icon: BookOpen, threshold: 75 },
    { label: "Creating assessments", icon: Target, threshold: 90 },
    { label: "Finalizing course", icon: CheckCircle2, threshold: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              AI Course Generator
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Transform your documents, presentations, and media into polished e-learning courses in minutes
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1.5 text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
              <Shield className="w-3 h-3" /> SCORM Compliant
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-blue-600 border-blue-500/20 bg-blue-500/10">
              <Smartphone className="w-3 h-3" /> Mobile Ready
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ─── Workflow Steps ─── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {([
            { key: "upload", label: "Upload Content", icon: Upload, step: 1 },
            { key: "configure", label: "Configure", icon: Settings2, step: 2 },
            { key: "generate", label: "Generate", icon: Sparkles, step: 3 },
            { key: "preview", label: "Preview & Export", icon: Eye, step: 4 },
          ] as const).map((s, i) => {
            const stepOrder = ["upload", "configure", "generate", "preview"];
            const currentIdx = stepOrder.indexOf(activeStep);
            const thisIdx = stepOrder.indexOf(s.key);
            const isActive = activeStep === s.key;
            const isDone = thisIdx < currentIdx;
            const isClickable = thisIdx <= currentIdx || (s.key === "configure" && allFilesAnalyzed);

            return (
              <div key={s.key} className="flex items-center gap-2 shrink-0">
                {i > 0 && <div className={`w-8 h-px ${isDone ? "bg-primary" : "bg-border"}`} />}
                <button
                  onClick={() => isClickable && setActiveStep(s.key)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  } ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-50"}`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.step}</span>
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════ STEP 1: UPLOAD ═══════════════ */}
      <AnimatePresence mode="wait">
        {activeStep === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.key,.mp3,.wav,.m4a,.mp4,.mov,.avi,.webm"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Upload Your Source Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop or click to browse. Supports documents, slides, audio, and video.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { icon: FileText, label: "PDF, DOC, TXT" },
                  { icon: Presentation, label: "PPT, KEY" },
                  { icon: Mic, label: "MP3, WAV" },
                  { icon: Video, label: "MP4, MOV" },
                ].map((ft) => (
                  <Badge key={ft.label} variant="secondary" className="gap-1 text-xs">
                    <ft.icon className="w-3 h-3" /> {ft.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => {
                    const Icon = FILE_TYPE_ICONS[file.type] || FileText;
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 sm:p-4"
                      >
                        <div className={`shrink-0 rounded-lg p-2 ${
                          file.status === "analyzed" ? "bg-emerald-500/10" : file.status === "error" ? "bg-red-500/10" : "bg-primary/10"
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            file.status === "analyzed" ? "text-emerald-500" : file.status === "error" ? "text-red-500" : "text-primary"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{file.size}</span>
                          </div>
                          {file.status === "uploading" && (
                            <Progress value={file.progress} className="h-1.5 mt-1" />
                          )}
                          {file.status === "processing" && (
                            <p className="text-[11px] text-primary flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Analyzing content with AI…
                            </p>
                          )}
                          {file.status === "analyzed" && (
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              {file.concepts.map((c) => (
                                <Badge key={c} variant="secondary" className="text-[9px] py-0">{c}</Badge>
                              ))}
                            </div>
                          )}
                          {file.status === "error" && (
                            <p className="text-[11px] text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Failed to process
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeFile(file.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!allFilesAnalyzed}
                onClick={() => {
                  if (!config.title) {
                    const firstFile = uploadedFiles[0]?.name?.replace(/\.[^.]+$/, "") || "Untitled";
                    setConfig((c) => ({ ...c, title: `${firstFile} — Training Course` }));
                  }
                  setActiveStep("configure");
                }}
                className="gap-2"
              >
                Continue to Configuration <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ STEP 2: CONFIGURE ═══════════════ */}
        {activeStep === "configure" && (
          <motion.div key="configure" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Course Settings */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-5">
                <h3 className="font-bold text-foreground flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" />Course Settings</h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Course Title</label>
                  <Input
                    value={config.title}
                    onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
                    placeholder="e.g. API Security Best Practices"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Target Role / Audience</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TARGET_ROLES.map((role) => (
                      <Button
                        key={role}
                        variant={config.targetRole === role ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setConfig((c) => ({ ...c, targetRole: role }))}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Difficulty Level</label>
                  <div className="flex gap-2">
                    {(["beginner", "intermediate", "advanced"] as const).map((d) => (
                      <Button
                        key={d}
                        variant={config.difficulty === d ? "default" : "outline"}
                        size="sm"
                        className="capitalize text-xs flex-1"
                        onClick={() => setConfig((c) => ({ ...c, difficulty: d }))}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Output Format</label>
                  <div className="flex gap-2">
                    {[
                      { val: "scorm" as const, label: "SCORM 1.2/2004" },
                      { val: "xapi" as const, label: "xAPI" },
                      { val: "html5" as const, label: "HTML5" },
                    ].map((fmt) => (
                      <Button
                        key={fmt.val}
                        variant={config.outputFormat === fmt.val ? "default" : "outline"}
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => setConfig((c) => ({ ...c, outputFormat: fmt.val }))}
                      >
                        {fmt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Mobile Responsive</span>
                  </div>
                  <Button
                    variant={config.mobileResponsive ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setConfig((c) => ({ ...c, mobileResponsive: !c.mobileResponsive }))}
                  >
                    {config.mobileResponsive ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>

              {/* Translation & Branding */}
              <div className="space-y-5">
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" />One-Click Translation</h3>
                  <p className="text-xs text-muted-foreground">Select output languages. Your course will be instantly translated.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => toggleTranslation(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          selectedTranslations.includes(lang.code)
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        {selectedTranslations.includes(lang.code) && <Check className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Analysis Summary */}
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-primary" />AI Content Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Source files</span>
                      <span className="font-bold text-foreground">{uploadedFiles.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Key concepts detected</span>
                      <span className="font-bold text-foreground">
                        {new Set(uploadedFiles.flatMap((f) => f.concepts)).size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Est. modules</span>
                      <span className="font-bold text-foreground">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Est. total duration</span>
                      <span className="font-bold text-foreground">~90 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Output languages</span>
                      <span className="font-bold text-foreground">{selectedTranslations.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("upload")} className="gap-2">
                Back
              </Button>
              <Button size="lg" onClick={generateCourse} disabled={!config.title.trim()} className="gap-2">
                <Sparkles className="w-4 h-4" /> Generate Course
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ STEP 3: GENERATING ═══════════════ */}
        {activeStep === "generate" && isGenerating && (
          <motion.div key="generate" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto py-10 text-center space-y-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-primary/25"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Generating Your Course</h2>
              <p className="text-sm text-muted-foreground">AI is analyzing your content and building interactive lessons…</p>
            </div>

            <div className="space-y-2">
              <Progress value={generationProgress} className="h-3" />
              <p className="text-sm font-bold text-primary">{generationProgress}%</p>
            </div>

            <div className="space-y-2">
              {GENERATION_STEPS.map((step) => {
                const isDone = generationProgress >= step.threshold;
                const isActive = !isDone && generationProgress >= (step.threshold - 20);
                return (
                  <div key={step.label} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isDone ? "text-foreground" : isActive ? "text-primary" : "text-muted-foreground/50"
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                    <span className="text-sm">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ STEP 4: PREVIEW & EXPORT ═══════════════ */}
        {activeStep === "preview" && !isGenerating && (
          <motion.div key="preview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            {/* Course Summary Banner */}
            <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/15 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{config.title || "Generated Course"}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {config.targetRole}</span>
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {generatedModules.length} modules</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {totalLessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {totalDuration} min</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {selectedTranslations.length} languages</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="w-4 h-4" /> Export {config.outputFormat.toUpperCase()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download as {config.outputFormat.toUpperCase()} package</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" className="gap-1.5">
                        <FileText className="w-4 h-4" /> Edit in Word
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download Word doc interface for fine-tuning</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Course Preview
              </h3>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {([
                  { key: "desktop" as const, icon: Monitor, label: "Desktop" },
                  { key: "tablet" as const, icon: Tablet, label: "Tablet" },
                  { key: "mobile" as const, icon: Phone, label: "Mobile" },
                ]).map((d) => (
                  <Tooltip key={d.key}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setPreviewDevice(d.key)}
                        className={`p-1.5 rounded-md transition-colors ${
                          previewDevice === d.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <d.icon className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{d.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Modules List */}
            <div className={`mx-auto transition-all ${
              previewDevice === "mobile" ? "max-w-[375px]" : previewDevice === "tablet" ? "max-w-[768px]" : "max-w-full"
            }`}>
              <div className="space-y-3">
                {generatedModules.map((mod, mi) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: mi * 0.08 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModuleExpand(mod.id)}
                      className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        mod.status === "reviewed" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                      }`}>
                        {mi + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{mod.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><BookOpen className="w-3 h-3" /> {mod.lessons.length} lessons</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {mod.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`text-[10px] ${
                          mod.status === "reviewed" ? "text-emerald-600 border-emerald-500/20 bg-emerald-500/10" :
                          mod.status === "published" ? "text-blue-600 border-blue-500/20 bg-blue-500/10" :
                          "text-muted-foreground"
                        }`}>
                          {mod.status}
                        </Badge>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                          expandedModules.has(mod.id) ? "rotate-90" : ""
                        }`} />
                      </div>
                    </button>

                    {/* Lessons */}
                    <AnimatePresence>
                      {expandedModules.has(mod.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border"
                        >
                          <div className="p-3 sm:p-4 space-y-2">
                            {mod.lessons.map((lesson, li) => {
                              const lType = LESSON_TYPE_COLORS[lesson.type];
                              return (
                                <div key={lesson.id} className="rounded-lg border border-border p-3 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group">
                                  <div className="flex items-start gap-3">
                                    <div className={`shrink-0 rounded-lg p-1.5 mt-0.5 ${lType.bg}`}>
                                      {lesson.type === "quiz" ? <Target className={`w-3.5 h-3.5 ${lType.text}`} /> :
                                       lesson.type === "video" ? <Play className={`w-3.5 h-3.5 ${lType.text}`} /> :
                                       lesson.type === "interactive" ? <Zap className={`w-3.5 h-3.5 ${lType.text}`} /> :
                                       lesson.type === "exercise" ? <Edit3 className={`w-3.5 h-3.5 ${lType.text}`} /> :
                                       <FileText className={`w-3.5 h-3.5 ${lType.text}`} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                                        <Badge variant="secondary" className={`text-[9px] py-0 ${lType.bg} ${lType.text} border-0`}>{lType.label}</Badge>
                                      </div>
                                      {editingLesson === lesson.id ? (
                                        <div className="mt-2 space-y-2">
                                          <textarea
                                            defaultValue={lesson.content}
                                            className="w-full min-h-[80px] bg-muted rounded-lg p-3 text-xs resize-none outline-none focus:ring-2 focus:ring-primary/50"
                                          />
                                          <div className="flex gap-2">
                                            <Button size="sm" className="text-xs h-7" onClick={() => setEditingLesson(null)}>Save</Button>
                                            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setEditingLesson(null)}>Cancel</Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-[11px] text-muted-foreground line-clamp-2">{lesson.content}</p>
                                      )}
                                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                                      </div>
                                    </div>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)}
                                          className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit lesson content</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Export & Translation Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">SCORM Package</h4>
                <p className="text-[11px] text-muted-foreground mb-3">Deploy to any LMS instantly</p>
                <Button variant="outline" size="sm" className="gap-1.5 w-full">
                  <Download className="w-3.5 h-3.5" /> Download .zip
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Word Document</h4>
                <p className="text-[11px] text-muted-foreground mb-3">Fine-tune with familiar tools</p>
                <Button variant="outline" size="sm" className="gap-1.5 w-full">
                  <Download className="w-3.5 h-3.5" /> Download .docx
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <Languages className="w-5 h-5 text-purple-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Translate Course</h4>
                <p className="text-[11px] text-muted-foreground mb-3">{selectedTranslations.length} languages selected</p>
                <Button variant="outline" size="sm" className="gap-1.5 w-full">
                  <Globe className="w-3.5 h-3.5" /> Translate All
                </Button>
              </div>
            </div>

            {/* Back / Regenerate */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("configure")} className="gap-2">
                Back to Settings
              </Button>
              <Button variant="outline" onClick={generateCourse} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Regenerate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Feature Highlights (always visible on upload step) ─── */}
      {activeStep === "upload" && uploadedFiles.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {[
            { icon: Brain, title: "Deep Content Analysis", desc: "AI infers key concepts and structures curriculum automatically", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Users, title: "Role-Based Courses", desc: "Tailored courses for specific job roles and skill levels", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Languages, title: "One-Click Translation", desc: "Instantly translate to 10+ languages with a single click", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Smartphone, title: "Mobile-Responsive", desc: "SCORM-compliant output ready for any LMS, any device", color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className={`${feat.bg} rounded-xl p-2.5 w-fit mb-3`}>
                <feat.icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">{feat.title}</h4>
              <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AI4ELearning;
