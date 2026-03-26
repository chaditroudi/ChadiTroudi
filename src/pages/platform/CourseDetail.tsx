import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ChevronDown, ChevronRight, Trophy, Layers, Star, GraduationCap, User, Languages, Brain, Captions } from "lucide-react";
import { getCourseById, lessonTypeConfig, difficultyConfig } from "@/data/courses-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useLang } from "@/hooks/use-lang";
import CourseExperienceAssistant from "@/components/platform/CourseExperienceAssistant";

const colorMap: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
  amber:   { gradient: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20", text: "text-amber-500", iconBg: "bg-amber-500/15" },
  blue:    { gradient: "from-blue-500/10 to-cyan-500/5", border: "border-blue-500/20", text: "text-blue-500", iconBg: "bg-blue-500/15" },
  violet:  { gradient: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/20", text: "text-violet-500", iconBg: "bg-violet-500/15" },
  emerald: { gradient: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/20", text: "text-emerald-500", iconBg: "bg-emerald-500/15" },
};

const detailCopy = {
  en: {
    notFound: "Course not found",
    back: "Back to courses",
    modules: "Modules",
    lessons: "Lessons",
    quizzes: "Quizzes",
    start: "Start learning",
    progress: "Course progress",
    completed: "lessons completed",
    courseModules: "Course modules",
    module: "Module",
    lessonCount: "lessons",
    pass: "Pass",
    multilingual: "Arabic, English, French support",
    adaptive: "AI-guided study support",
    access: "Accessible review modes",
  },
  fr: {
    notFound: "Cours introuvable",
    back: "Retour aux cours",
    modules: "Modules",
    lessons: "Leçons",
    quizzes: "Quiz",
    start: "Commencer",
    progress: "Progression du cours",
    completed: "leçons terminées",
    courseModules: "Modules du cours",
    module: "Module",
    lessonCount: "leçons",
    pass: "Réussite",
    multilingual: "Support arabe, anglais, français",
    adaptive: "Accompagnement IA adaptatif",
    access: "Révision accessible",
  },
  ar: {
    notFound: "تعذر العثور على المقرر",
    back: "العودة إلى المقررات",
    modules: "الوحدات",
    lessons: "الدروس",
    quizzes: "الاختبارات",
    start: "ابدأ التعلم",
    progress: "تقدم المقرر",
    completed: "درسًا مكتملًا",
    courseModules: "وحدات المقرر",
    module: "الوحدة",
    lessonCount: "دروس",
    pass: "نسبة النجاح",
    multilingual: "دعم بالعربية والإنجليزية والفرنسية",
    adaptive: "مساندة تعلم بالذكاء الاصطناعي",
    access: "مراجعة ميسرة",
  },
} as const;

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { lang, dir } = useLang();
  const uiLang = lang === "fr" || lang === "ar" ? lang : "en";
  const ui = detailCopy[uiLang];
  const course = getCourseById(courseId || "");
  const [openModule, setOpenModule] = useState<string | null>(course?.modules[0]?.id || null);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground font-semibold mb-1">{ui.notFound}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/platform/courses")}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {ui.back}
        </Button>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const totalQuizzes = course.modules.length;
  const c = colorMap[course.color];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6" dir={dir}>
      {/* Back */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/platform/courses")} className="text-muted-foreground hover:text-foreground -ml-2 mb-2">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {ui.back}
        </Button>
      </motion.div>

      {/* Course Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className={`bg-gradient-to-r ${c.gradient} border ${c.border} rounded-xl p-5 sm:p-6`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`${c.iconBg} rounded-xl p-3 w-fit shrink-0`}>
            <span className="text-3xl">{course.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">{course.title}</h1>
              <Badge variant="outline" className={`text-[10px] font-bold ${difficultyConfig[course.difficulty].color} ${difficultyConfig[course.difficulty].bg} border-transparent`}>
                {difficultyConfig[course.difficulty].label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{course.description}</p>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-xs">
                <Layers className="w-3 h-3" /> {course.modules.length} {ui.modules}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <BookOpen className="w-3 h-3" /> {totalLessons} {ui.lessons}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Clock className="w-3 h-3" /> {course.estimatedHours}h
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Trophy className="w-3 h-3" /> {totalQuizzes} {ui.quizzes}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <User className="w-3 h-3" /> {course.instructor}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const firstMod = course.modules[0];
                const firstLesson = firstMod?.lessons[0];
                if (firstMod && firstLesson) navigate(`/platform/courses/${course.id}/${firstMod.id}/${firstLesson.id}`);
              }}
            >
              <GraduationCap className="w-4 h-4" /> {ui.start}
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1.5 border-primary/20 bg-background/60 text-xs">
            <Languages className="w-3 h-3 text-primary" /> {ui.multilingual}
          </Badge>
          <Badge variant="outline" className="gap-1.5 border-primary/20 bg-background/60 text-xs">
            <Brain className="w-3 h-3 text-primary" /> {ui.adaptive}
          </Badge>
          <Badge variant="outline" className="gap-1.5 border-primary/20 bg-background/60 text-xs">
            <Captions className="w-3 h-3 text-primary" /> {ui.access}
          </Badge>
        </div>

        {/* Overall progress */}
        <div className="mt-5 pt-4 border-t border-border/50">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{ui.progress}</span>
            <span>0 / {totalLessons} {ui.completed}</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-1.5">
        {course.tags.map(tag => (
          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
        ))}
      </motion.div>

      <CourseExperienceAssistant
        courseTitle={course.title}
        courseDescription={course.description}
        tags={course.tags}
        difficulty={course.difficulty}
        estimatedHours={course.estimatedHours}
      />

      {/* Modules Accordion */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> {ui.courseModules}
        </h2>

        {course.modules.map((mod, modIdx) => {
          const isOpen = openModule === mod.id;
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + modIdx * 0.06 }}
              className="rounded-xl border bg-card border-border overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => setOpenModule(isOpen ? null : mod.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {mod.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-foreground">
                      {ui.module} {modIdx + 1}: {mod.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">{mod.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Badge variant="secondary" className="text-[10px] hidden sm:flex">{mod.lessons.length} {ui.lessonCount}</Badge>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              {/* Module Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-1.5 border-t border-border/50 pt-3">
                      {mod.lessons.map((lesson, lessonIdx) => {
                        const typeConf = lessonTypeConfig[lesson.type];
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * lessonIdx }}
                          >
                            <Link
                              to={`/platform/courses/${course.id}/${mod.id}/${lesson.id}`}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-sm">
                                  {typeConf.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <span>{typeConf.label}</span>
                                    <span>·</span>
                                    <span>{lesson.duration} min</span>
                                    <span>·</span>
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 text-yellow-600 border-yellow-500/20 bg-yellow-500/10">
                                      <Star className="w-2.5 h-2.5 mr-0.5" />{lesson.xpReward} XP
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                          </motion.div>
                        );
                      })}

                      {/* Quiz Card */}
                      <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{mod.quiz.title}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {mod.quiz.questions.length} {ui.quizzes.toLowerCase()} · {ui.pass}: {mod.quiz.passingScore}% · +{mod.quiz.xpReward} XP
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
