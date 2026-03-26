import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Captions,
  ChevronRight,
  Languages,
  MessageSquareText,
  Orbit,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang, type Lang } from "@/hooks/use-lang";
import { AIChatPanel } from "@/features/ai-assistant/components/AIChatPanel";
import { useAIAssistant } from "@/features/ai-assistant/hooks/use-ai-assistant";

type SupportLang = "en" | "fr" | "ar";

interface CourseExperienceAssistantProps {
  courseTitle: string;
  courseDescription: string;
  tags: string[];
  difficulty: string;
  estimatedHours?: number;
  moduleTitle?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  lessonContent?: string;
  lessonType?: string;
}

type TabKey = "brief" | "chat" | "formats" | "access";
type PromptKey = "translate" | "explain" | "quiz" | "coach";

const supportLangMeta: Record<SupportLang, { label: string; short: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", short: "EN", dir: "ltr" },
  fr: { label: "Français", short: "FR", dir: "ltr" },
  ar: { label: "العربية", short: "AR", dir: "rtl" },
};

const localeNames: Record<SupportLang, Record<SupportLang, string>> = {
  en: { en: "English", fr: "French", ar: "Arabic" },
  fr: { en: "anglais", fr: "français", ar: "arabe" },
  ar: { en: "الإنجليزية", fr: "الفرنسية", ar: "العربية" },
};

const copy = {
  en: {
    title: "AI learning support",
    subtitle: "Multilingual help for translation, adaptive study guidance, and accessible review.",
    live: "Context-aware",
    demo: "Demo mode",
    tabs: { brief: "Smart brief", chat: "AI chat", formats: "Video ideas", access: "Accessibility" },
    quickActions: {
      translate: "Translate this lesson",
      explain: "Explain more simply",
      quiz: "Create a quick quiz",
      coach: "Coach me step by step",
    },
    summaryLabel: "Session snapshot",
    conceptsLabel: "Key concepts to focus on",
    supportLabel: "What the assistant can do right now",
    chatLabel: "Ask in your preferred language",
    videoLabel: "AI-first video formats for this course",
    accessLabel: "Inclusive learning adjustments",
    outcomes: "Target outcomes",
  },
  fr: {
    title: "Support d'apprentissage IA",
    subtitle: "Aide multilingue pour la traduction, l'accompagnement adaptatif et la révision accessible.",
    live: "Contexte du cours",
    demo: "Mode démo",
    tabs: { brief: "Résumé intelligent", chat: "Chat IA", formats: "Idées vidéo", access: "Accessibilité" },
    quickActions: {
      translate: "Traduire cette leçon",
      explain: "Expliquer plus simplement",
      quiz: "Créer un mini quiz",
      coach: "Me guider étape par étape",
    },
    summaryLabel: "Vue rapide de la session",
    conceptsLabel: "Concepts clés à travailler",
    supportLabel: "Ce que l'assistant peut faire maintenant",
    chatLabel: "Posez votre question dans votre langue",
    videoLabel: "Formats vidéo pilotés par l'IA",
    accessLabel: "Ajustements inclusifs",
    outcomes: "Objectifs visés",
  },
  ar: {
    title: "مساندة تعلم بالذكاء الاصطناعي",
    subtitle: "دعم متعدد اللغات للترجمة والشرح التكيفي والمراجعة الميسرة.",
    live: "مدعوم بسياق الدرس",
    demo: "وضع تجريبي",
    tabs: { brief: "ملخص ذكي", chat: "محادثة ذكية", formats: "أفكار فيديو", access: "إتاحة" },
    quickActions: {
      translate: "ترجمة هذا الدرس",
      explain: "شرح أبسط",
      quiz: "إنشاء اختبار سريع",
      coach: "رافقني خطوة بخطوة",
    },
    summaryLabel: "لقطة سريعة للجلسة",
    conceptsLabel: "المفاهيم الأساسية",
    supportLabel: "ما الذي يستطيع المساعد فعله الآن",
    chatLabel: "اسأل بلغتك المفضلة",
    videoLabel: "صيغ فيديو مدعومة بالذكاء الاصطناعي",
    accessLabel: "تعديلات شاملة للتعلم",
    outcomes: "نواتج التعلم",
  },
} as const;

const normalizeSupportLang = (lang: Lang): SupportLang => {
  if (lang === "fr" || lang === "ar") return lang;
  return "en";
};

const pickConcepts = (lessonContent?: string, tags?: string[]) => {
  const fromContent = (lessonContent || "")
    .split("\n")
    .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
    .filter((line) => line.length > 8)
    .slice(0, 4);

  if (fromContent.length >= 3) return fromContent;

  return (tags || []).slice(0, 4);
};

export default function CourseExperienceAssistant({
  courseTitle,
  courseDescription,
  tags,
  difficulty,
  estimatedHours,
  moduleTitle,
  lessonTitle,
  lessonDescription,
  lessonContent,
  lessonType,
}: CourseExperienceAssistantProps) {
  const { lang } = useLang();
  const { sendMessage, isDemoMode } = useAIAssistant();
  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const [supportLang, setSupportLang] = useState<SupportLang>(normalizeSupportLang(lang));

  const ui = copy[supportLang];
  const concepts = useMemo(() => pickConcepts(lessonContent, tags), [lessonContent, tags]);

  const assistantContext = useMemo(
    () => ({
      currentPage: lessonTitle ? `Course lesson: ${courseTitle} / ${moduleTitle || ""} / ${lessonTitle}` : `Course detail: ${courseTitle}`,
      experience: difficulty,
      goal: `Support the learner in ${localeNames.en[supportLang]} while preserving accurate Java terminology and giving culturally clear explanations.`,
      skillContext: [
        `Course: ${courseTitle}`,
        `Course summary: ${courseDescription}`,
        moduleTitle ? `Module: ${moduleTitle}` : "",
        lessonTitle ? `Lesson: ${lessonTitle}` : "",
        lessonDescription ? `Lesson description: ${lessonDescription}` : "",
        lessonType ? `Lesson type: ${lessonType}` : "",
        estimatedHours ? `Estimated course duration: ${estimatedHours} hours` : "",
        `Focus tags: ${tags.slice(0, 6).join(", ")}`,
        lessonContent ? `Lesson content excerpt: ${lessonContent.slice(0, 1200)}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
    [courseDescription, courseTitle, difficulty, estimatedHours, lessonContent, lessonDescription, lessonTitle, lessonType, moduleTitle, supportLang, tags]
  );

  const brief = useMemo(() => {
    if (supportLang === "fr") {
      return {
        summary: lessonTitle
          ? `Vous travaillez actuellement sur ${lessonTitle}. Ce module peut être expliqué, reformulé ou préparé en quiz en français, tout en conservant les mots-clés Java en anglais.`
          : `Ce parcours ${courseTitle} peut être accompagné en français avec traduction guidée, reformulation contextuelle et aide interactive sur chaque module.`,
        outcomes: [
          `Comprendre ${lessonTitle ? "la logique de la leçon" : "les objectifs du cours"} sans perdre la précision technique.`,
          "Passer rapidement d'une explication conceptuelle à un exemple concret.",
          "Recevoir une aide personnalisée selon votre niveau et votre rythme.",
        ],
        support: [
          "Traduire les explications en français avec vocabulaire Java cohérent.",
          "Créer des micro-quiz après chaque concept important.",
          "Reformuler le contenu en étapes plus courtes et plus visuelles.",
        ],
      };
    }

    if (supportLang === "ar") {
      return {
        summary: lessonTitle
          ? `أنت تراجع الآن درس ${lessonTitle}. يمكن للمساعد شرح هذا المحتوى أو ترجمته أو تحويله إلى تدريب تفاعلي بالعربية مع الإبقاء على مصطلحات Java كما هي.`
          : `يمكن تقديم مسار ${courseTitle} بدعم عربي يشرح المفاهيم خطوة بخطوة ويحول الوحدات إلى مسارات تعلم أوضح وأسهل متابعة.`,
        outcomes: [
          `فهم ${lessonTitle ? "منطق الدرس" : "أهداف المقرر"} بطريقة أبسط مع دقة تقنية عالية.`,
          "الانتقال من الشرح النظري إلى مثال عملي مرتبط بسياق الطالب.",
          "الحصول على مساعدة شخصية حسب المستوى والسرعة المناسبة للتعلم.",
        ],
        support: [
          "ترجمة الشروحات إلى العربية مع الحفاظ على مصطلحات Java الأساسية.",
          "إنشاء اختبارات قصيرة بعد كل مفهوم مهم.",
          "إعادة تنظيم المحتوى إلى خطوات أبسط وأكثر وضوحًا.",
        ],
      };
    }

    return {
      summary: lessonTitle
        ? `You are currently studying ${lessonTitle}. The assistant can translate, simplify, and quiz this lesson in ${localeNames.en[supportLang]} while keeping Java terminology accurate.`
        : `${courseTitle} can be delivered with multilingual explanations, adaptive review prompts, and contextual help aligned with the learner's current module.`,
      outcomes: [
        `Understand ${lessonTitle ? "the lesson flow" : "the course structure"} without losing technical precision.`,
        "Move from explanation to practice with short, contextual prompts.",
        "Get help matched to beginner pacing and confidence-building review.",
      ],
      support: [
        `Translate explanations into ${localeNames.en[supportLang]} with accurate Java wording.`,
        "Generate short quizzes after each core concept.",
        "Reframe dense material into simpler, learner-friendly steps.",
      ],
    };
  }, [courseTitle, lessonTitle, supportLang]);

  const videoFormats = useMemo(() => {
    if (supportLang === "fr") {
      return [
        {
          title: "Vidéo à embranchements",
          description: "L'étudiant choisit une piste débutant, révision ou défi, et l'IA adapte les exemples Java en temps réel.",
        },
        {
          title: "Pause-prédiction",
          description: "La vidéo s'arrête avant le résultat d'un code, pose une question, puis personnalise le feedback selon la réponse.",
        },
        {
          title: "Walkthrough codé + checkpoints",
          description: "Un avatar IA commente le code, vérifie la compréhension toutes les 2 à 3 minutes et propose une remédiation ciblée.",
        },
        {
          title: "Récap adaptatif",
          description: "Une capsule courte en fin de module réutilise les erreurs fréquentes de l'apprenant pour renforcer la mémorisation.",
        },
      ];
    }

    if (supportLang === "ar") {
      return [
        {
          title: "فيديو متشعب حسب المستوى",
          description: "يختار الطالب مسار مبتدئ أو مراجعة أو تحدي، ثم يكيف الذكاء الاصطناعي الأمثلة البرمجية لحظيًا.",
        },
        {
          title: "أوقف وتوقع",
          description: "يتوقف الفيديو قبل ناتج الكود، يطرح سؤالًا سريعًا، ثم يقدم تغذية راجعة شخصية حسب إجابة الطالب.",
        },
        {
          title: "شرح كود مع نقاط تحقق",
          description: "معلّم افتراضي يشرح الكود خطوة بخطوة ويقيس الفهم كل بضع دقائق مع توجيه علاجي عند الحاجة.",
        },
        {
          title: "خلاصة تكيفية",
          description: "فيديو قصير في نهاية الوحدة يعيد بناء المفاهيم الأكثر صعوبة وفق أخطاء المتعلم الفعلية.",
        },
      ];
    }

    return [
      {
        title: "Branching explainer video",
        description: "Learners pick beginner, revision, or challenge mode and the AI adjusts Java examples in real time.",
      },
      {
        title: "Pause-and-predict",
        description: "The video stops before a code outcome, asks for a prediction, then gives personalized feedback based on the answer.",
      },
      {
        title: "Code walkthrough with checkpoints",
        description: "An AI tutor narrates the code, checks understanding every few minutes, and redirects to targeted support when needed.",
      },
      {
        title: "Adaptive recap reel",
        description: "A short recap at the end of each module focuses on the learner's mistakes and confidence gaps.",
      },
    ];
  }, [supportLang]);

  const accessIdeas = useMemo(() => {
    if (supportLang === "fr") {
      return [
        "Sous-titres multilingues et transcription téléchargeable pour réécoute asynchrone.",
        "Version en langage simplifié avec segments courts pour réduire la charge cognitive.",
        "Glossaire bilingue des mots-clés Java, utile pour les étudiants qui changent de langue d'étude.",
        "Rythme flexible: narration, texte, quiz courts et repères visuels cohérents.",
      ];
    }

    if (supportLang === "ar") {
      return [
        "ترجمة نصية متعددة اللغات مع تفريغ قابل للتنزيل للمراجعة لاحقًا.",
        "صياغة مبسطة بخطوات قصيرة لتخفيف الحمل المعرفي على المتعلم.",
        "مسرد ثنائي اللغة لمصطلحات Java لمساندة الانتقال بين العربية والإنجليزية والفرنسية.",
        "إيقاع تعلم مرن يجمع بين السرد الصوتي والنص والاختبارات القصيرة والمؤشرات البصرية.",
      ];
    }

    return [
      "Multilingual captions and downloadable transcripts for asynchronous review.",
      "Plain-language rewrites and shorter content segments to reduce cognitive load.",
      "A bilingual Java glossary for learners switching between English, French, and Arabic.",
      "Flexible pacing through narration, text, micro-quizzes, and visual checkpoints.",
    ];
  }, [supportLang]);

  const prompts = useMemo(
    () => ({
      translate:
        `Translate the current ${lessonTitle ? "lesson" : "course overview"} into ${localeNames.en[supportLang]}. Keep Java keywords such as class, object, loop, and method in English when needed, and make the explanation natural for students.` +
        (lessonTitle ? ` Focus on ${lessonTitle}.` : ""),
      explain:
        `Explain the current ${lessonTitle ? "lesson" : "course"} in ${localeNames.en[supportLang]} for a beginner. Use step-by-step reasoning, one concrete Java example, and a short recap.` +
        (lessonTitle ? ` The lesson is ${lessonTitle}.` : ` The course is ${courseTitle}.`),
      quiz:
        `Create a short adaptive quiz in ${localeNames.en[supportLang]} for the learner based on the current ${lessonTitle ? "lesson" : "course"}. Include answers and explanations tuned for beginners.` +
        (lessonTitle ? ` Lesson: ${lessonTitle}.` : ""),
      coach:
        `Act as a multilingual Java coach and guide the learner in ${localeNames.en[supportLang]}. Break the current ${lessonTitle ? "lesson" : "course"} into the next 3 practical steps and point out common mistakes.` +
        (lessonTitle ? ` Lesson: ${lessonTitle}.` : ""),
    }),
    [courseTitle, lessonTitle, supportLang]
  );

  const requestPrompt = async (promptKey: PromptKey) => {
    setActiveTab("chat");
    await sendMessage(prompts[promptKey], assistantContext);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-background overflow-hidden"
    >
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3" /> {ui.live}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Languages className="w-3 h-3" /> EN / FR / AR
              </Badge>
              {isDemoMode && (
                <Badge variant="outline" className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <Bot className="w-3 h-3" /> {ui.demo}
                </Badge>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <WandSparkles className="w-5 h-5 text-primary" /> {ui.title}
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl">{ui.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2" dir={supportLangMeta[supportLang].dir}>
            {Object.entries(supportLangMeta).map(([key, meta]) => {
              const isActive = key === supportLang;
              return (
                <Button
                  key={key}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="min-w-16"
                  onClick={() => setSupportLang(key as SupportLang)}
                >
                  {meta.short}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" dir={supportLangMeta[supportLang].dir}>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => requestPrompt("translate")}>
            <Languages className="w-3.5 h-3.5" /> {ui.quickActions.translate}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => requestPrompt("explain")}>
            <MessageSquareText className="w-3.5 h-3.5" /> {ui.quickActions.explain}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => requestPrompt("quiz")}>
            <Brain className="w-3.5 h-3.5" /> {ui.quickActions.quiz}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => requestPrompt("coach")}>
            <ChevronRight className="w-3.5 h-3.5" /> {ui.quickActions.coach}
          </Button>
        </div>
      </div>

      <div className="p-5">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto gap-1 bg-muted/40 p-1 md:grid-cols-4">
            <TabsTrigger value="brief" className="text-xs sm:text-sm">{ui.tabs.brief}</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs sm:text-sm">{ui.tabs.chat}</TabsTrigger>
            <TabsTrigger value="formats" className="text-xs sm:text-sm">{ui.tabs.formats}</TabsTrigger>
            <TabsTrigger value="access" className="text-xs sm:text-sm">{ui.tabs.access}</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" dir={supportLangMeta[supportLang].dir}>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">{ui.summaryLabel}</p>
                <p className="text-sm leading-7 text-foreground">{brief.summary}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">{ui.outcomes}</p>
                  <div className="space-y-2">
                    {brief.outcomes.map((outcome) => (
                      <div key={outcome} className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm text-foreground">
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">{ui.conceptsLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {concepts.map((concept) => (
                      <Badge key={concept} variant="secondary" className="px-2.5 py-1 text-xs whitespace-normal text-left">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">{ui.supportLabel}</p>
                  <div className="space-y-2">
                    {brief.support.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <Orbit className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium text-foreground">{ui.chatLabel}</p>
                <p className="text-xs text-muted-foreground">{supportLangMeta[supportLang].label}</p>
              </div>
              <AIChatPanel mode="compact" showAvatar={false} context={assistantContext} />
            </div>
          </TabsContent>

          <TabsContent value="formats" className="mt-4">
            <div className="rounded-xl border bg-card p-4" dir={supportLangMeta[supportLang].dir}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">{ui.videoLabel}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {videoFormats.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-6">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="access" className="mt-4">
            <div className="rounded-xl border bg-card p-4" dir={supportLangMeta[supportLang].dir}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">{ui.accessLabel}</p>
              <ScrollArea className="max-h-72 pr-4">
                <div className="space-y-3">
                  {accessIdeas.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-sm text-foreground">
                      <Captions className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
}