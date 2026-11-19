import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb, Star, Trophy, Code2, Eye, Type } from "lucide-react";
import { getCourseById, getModuleById, getLessonById, lessonTypeConfig } from "@/data/courses-data";
import type { Quiz, QuizQuestion } from "@/data/courses-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import AITutorSpeaker from "@/components/platform/AITutorSpeaker";
import { useLang } from "@/hooks/use-lang";
import CourseExperienceAssistant from "@/components/platform/CourseExperienceAssistant";

const lessonViewerCopy = {
  en: {
    lessonNotFound: "Lesson not found",
    backToCourses: "Back to courses",
    moduleProgress: "Module progress",
    focusTitle: "Reading and focus controls",
    focusDesc: "Adjust the lesson view for different learning preferences.",
    standard: "Standard text",
    comfortable: "Comfortable reading",
    focusOn: "Focus mode on",
    focusOff: "Focus mode off",
    focusHint: "Focus mode hides the speaking avatar so the lesson stays visually lighter.",
    lessonContent: "Lesson content",
    exerciseWorkspace: "Exercise workspace",
    interactiveEditor: "Interactive editor",
    xpCompletion: "XP on completion",
    previous: "Previous",
    nextLesson: "Next lesson",
    takeQuiz: "Take module quiz",
    exitQuiz: "Exit quiz",
    question: "Question",
    submit: "Submit answer",
    seeResults: "See results",
    quizPassed: "Quiz passed!",
    notQuite: "Not quite...",
    retryQuiz: "Retry quiz",
    backToCourse: "Back to course",
    needToPass: "Need",
    toPass: "to pass",
  },
  fr: {
    lessonNotFound: "Leçon introuvable",
    backToCourses: "Retour aux cours",
    moduleProgress: "Progression du module",
    focusTitle: "Lecture et concentration",
    focusDesc: "Adaptez l'affichage de la leçon à votre préférence d'apprentissage.",
    standard: "Texte standard",
    comfortable: "Lecture confortable",
    focusOn: "Mode focus activé",
    focusOff: "Mode focus désactivé",
    focusHint: "Le mode focus masque l'avatar parlant pour alléger l'écran pendant la lecture.",
    lessonContent: "Contenu de la leçon",
    exerciseWorkspace: "Espace d'exercice",
    interactiveEditor: "Éditeur interactif",
    xpCompletion: "XP à la fin",
    previous: "Précédent",
    nextLesson: "Leçon suivante",
    takeQuiz: "Passer le quiz du module",
    exitQuiz: "Quitter le quiz",
    question: "Question",
    submit: "Valider la réponse",
    seeResults: "Voir les résultats",
    quizPassed: "Quiz réussi !",
    notQuite: "Pas encore...",
    retryQuiz: "Recommencer",
    backToCourse: "Retour au cours",
    needToPass: "Il faut",
    toPass: "pour réussir",
  },
  ar: {
    lessonNotFound: "تعذر العثور على الدرس",
    backToCourses: "العودة إلى المقررات",
    moduleProgress: "تقدم الوحدة",
    focusTitle: "إعدادات القراءة والتركيز",
    focusDesc: "خصص عرض الدرس بما يناسب أسلوب تعلمك.",
    standard: "نص عادي",
    comfortable: "قراءة مريحة",
    focusOn: "تفعيل وضع التركيز",
    focusOff: "إيقاف وضع التركيز",
    focusHint: "وضع التركيز يخفي المدرس المتحدث ليبقى الدرس أخف بصريًا أثناء القراءة.",
    lessonContent: "محتوى الدرس",
    exerciseWorkspace: "مساحة التمرين",
    interactiveEditor: "المحرر التفاعلي",
    xpCompletion: "نقاط XP عند الإكمال",
    previous: "السابق",
    nextLesson: "الدرس التالي",
    takeQuiz: "ابدأ اختبار الوحدة",
    exitQuiz: "إنهاء الاختبار",
    question: "السؤال",
    submit: "إرسال الإجابة",
    seeResults: "عرض النتائج",
    quizPassed: "تم اجتياز الاختبار!",
    notQuite: "ليس بعد...",
    retryQuiz: "أعد الاختبار",
    backToCourse: "العودة إلى المقرر",
    needToPass: "تحتاج إلى",
    toPass: "للنجاح",
  },
} as const;

export default function CourseLessonViewer() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { lang, dir } = useLang();
  const uiLang = lang === "fr" || lang === "ar" ? lang : "en";
  const ui = lessonViewerCopy[uiLang];

  const course = getCourseById(courseId || "");
  const module_ = getModuleById(courseId || "", moduleId || "");
  const lesson = getLessonById(courseId || "", moduleId || "", lessonId || "");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState<{ current: number; answers: (number | null)[]; submitted: boolean }>({ current: 0, answers: [], submitted: false });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [readingMode, setReadingMode] = useState<"standard" | "comfortable">("standard");
  const [focusMode, setFocusMode] = useState(false);

  if (!course || !module_ || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Code2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground font-semibold mb-1">{ui.lessonNotFound}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/platform/courses")}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {ui.backToCourses}
        </Button>
      </div>
    );
  }

  const currentIndex = module_.lessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? module_.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < module_.lessons.length - 1 ? module_.lessons[currentIndex + 1] : null;
  const typeConf = lessonTypeConfig[lesson.type];
  const quiz = module_.quiz;
  const progressPercent = Math.round(((currentIndex + 1) / module_.lessons.length) * 100);
  const contentTypography = readingMode === "comfortable" ? "text-base leading-8 sm:text-[1.02rem]" : "text-sm leading-relaxed";

  const goToLesson = (lId: string) => navigate(`/platform/courses/${courseId}/${moduleId}/${lId}`);

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizState({ current: 0, answers: new Array(quiz.questions.length).fill(null), submitted: false });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const submitQuizAnswer = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.current] = selectedAnswer;
    setQuizState({ ...quizState, answers: newAnswers });
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (quizState.current < quiz.questions.length - 1) {
      setQuizState({ ...quizState, current: quizState.current + 1 });
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState({ ...quizState, submitted: true });
    }
  };

  const quizScore = quizState.answers.filter((a, i) => a === quiz.questions[i].correct).length;
  const quizPercent = Math.round((quizScore / quiz.questions.length) * 100);
  const passed = quizPercent >= quiz.passingScore;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-5" dir={dir}>
      {/* Top Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/platform/courses/${courseId}`)} className="text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {course.title}
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{module_.title}</Badge>
            <Badge variant="outline" className="text-[10px]">{currentIndex + 1}/{module_.lessons.length}</Badge>
          </div>
        </div>
      </motion.div>

      {/* Module Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>{ui.moduleProgress}</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </motion.div>

      {!showQuiz ? (
        <>
          {/* Lesson Header */}
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                {typeConf.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{typeConf.label}</Badge>
                  <span className="text-[10px] text-muted-foreground">{lesson.duration} min</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">{lesson.title}</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{lesson.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{ui.focusTitle}</h2>
                <p className="text-xs text-muted-foreground mt-1">{ui.focusDesc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={readingMode === "standard" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setReadingMode("standard")}
                >
                  <Type className="w-3.5 h-3.5" /> {ui.standard}
                </Button>
                <Button
                  variant={readingMode === "comfortable" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setReadingMode("comfortable")}
                >
                  <Type className="w-3.5 h-3.5" /> {ui.comfortable}
                </Button>
                <Button
                  variant={focusMode ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setFocusMode((current) => !current)}
                >
                  <Eye className="w-3.5 h-3.5" /> {focusMode ? ui.focusOff : ui.focusOn}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{ui.focusHint}</p>
          </motion.div>

          <CourseExperienceAssistant
            courseTitle={course.title}
            courseDescription={course.description}
            tags={course.tags}
            difficulty={course.difficulty}
            estimatedHours={course.estimatedHours}
            moduleTitle={module_.title}
            lessonTitle={lesson.title}
            lessonDescription={lesson.description}
            lessonContent={lesson.content}
            lessonType={lesson.type}
          />

          {/* AI Tutor Avatar — replaces video placeholder for all lesson types */}
          {!focusMode && (
            <motion.div
              key={`tutor-${lesson.id}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <AITutorSpeaker
                lessonTitle={lesson.title}
                lessonDescription={lesson.description}
                lessonContent={lesson.content}
                codeTemplate={lesson.codeTemplate}
                uiLanguage={uiLang}
              />
            </motion.div>
          )}

          {/* Lesson Article Content */}
          <motion.div
            key={`content-${lesson.id}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-xl border bg-card border-border overflow-hidden"
          >
            {/* Slides navigation (if applicable) */}
            {lesson.type === "slides" && lesson.slides && (
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Slide {currentSlide + 1} of {lesson.slides.length}: {lesson.slides[currentSlide]}
                  </h3>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentSlide === 0} onClick={() => setCurrentSlide(s => s - 1)}>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentSlide === lesson.slides.length - 1} onClick={() => setCurrentSlide(s => s + 1)}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {lesson.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1 flex-1 rounded-full transition-all ${i === currentSlide ? "bg-primary" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Article content for all lesson types */}
            <div className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-primary" /> {ui.lessonContent}
              </h3>
              <div className={`${contentTypography} text-muted-foreground whitespace-pre-line`}>{lesson.content}</div>
            </div>

            {/* Code template (interactive / exercise) */}
            {lesson.codeTemplate && (
              <div className="p-5 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {lesson.type === "exercise" ? "Exercise Workspace" : "Interactive Editor"}
                  </span>
                </div>
                <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs">
                  <code className={lesson.type === "exercise" ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"}>{lesson.codeTemplate}</code>
                </pre>
                <div className="mt-2 text-[10px] text-muted-foreground">
                  {lesson.type === "exercise" ? ui.exerciseWorkspace : ui.interactiveEditor}
                </div>
              </div>
            )}
          </motion.div>

          {/* XP Badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex justify-center">
            <Badge variant="outline" className="gap-1.5 text-yellow-600 border-yellow-500/20 bg-yellow-500/10">
              <Star className="w-3 h-3" /> +{lesson.xpReward} {ui.xpCompletion}
            </Badge>
          </motion.div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-between pt-2">
            {prevLesson ? (
              <Button variant="outline" size="sm" onClick={() => { goToLesson(prevLesson.id); setCurrentSlide(0); }}>
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {ui.previous}
              </Button>
            ) : <div />}

            {nextLesson ? (
              <Button size="sm" onClick={() => { goToLesson(nextLesson.id); setCurrentSlide(0); }}>
                {ui.nextLesson} <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button size="sm" className="gap-1.5" onClick={startQuiz}>
                <Trophy className="w-3.5 h-3.5" /> {ui.takeQuiz}
              </Button>
            )}
          </motion.div>

        </>
      ) : (
        <QuizView
          quiz={quiz}
          quizState={quizState}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          quizScore={quizScore}
          quizPercent={quizPercent}
          passed={passed}
          labels={ui}
          onSelectAnswer={setSelectedAnswer}
          onSubmitAnswer={submitQuizAnswer}
          onNextQuestion={nextQuestion}
          onRetry={startQuiz}
          onExit={() => setShowQuiz(false)}
          onFinish={() => navigate(`/platform/courses/${courseId}`)}
        />
      )}
    </div>
  );
}

/* ── Quiz Sub-component ── */
function QuizView({
  quiz, quizState, selectedAnswer, showExplanation, quizScore, quizPercent, passed, labels,
  onSelectAnswer, onSubmitAnswer, onNextQuestion, onRetry, onExit, onFinish,
}: {
  quiz: Quiz;
  quizState: { current: number; answers: (number | null)[]; submitted: boolean };
  selectedAnswer: number | null;
  showExplanation: boolean;
  quizScore: number;
  quizPercent: number;
  passed: boolean;
  labels: typeof lessonViewerCopy.en;
  onSelectAnswer: (i: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onRetry: () => void;
  onExit: () => void;
  onFinish: () => void;
}) {
  if (quizState.submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <motion.div
          animate={{ rotate: passed ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl mb-4"
        >
          {passed ? "🎉" : "😔"}
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-1.5">{passed ? labels.quizPassed : labels.notQuite}</h2>
        <p className="text-muted-foreground text-sm mb-6">
          You scored {quizScore}/{quiz.questions.length} ({quizPercent}%) — {passed ? `+${quiz.xpReward} XP!` : `${labels.needToPass} ${quiz.passingScore}% ${labels.toPass}`}
        </p>
        <div className="w-48 mx-auto mb-8">
          <Progress value={quizPercent} className="h-2.5" />
        </div>
        <div className="flex justify-center gap-3">
          {!passed && (
            <Button variant="default" onClick={onRetry}>{labels.retryQuiz}</Button>
          )}
          <Button variant="outline" onClick={onFinish}>{labels.backToCourse}</Button>
        </div>
      </motion.div>
    );
  }

  const q: QuizQuestion = quiz.questions[quizState.current];
  const answered = quizState.answers[quizState.current] !== null;

  return (
    <motion.div key={quizState.current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> {quiz.title}
        </h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onExit}>{labels.exitQuiz}</Button>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {quiz.questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i === quizState.current ? "bg-primary" :
              quizState.answers[i] !== null ? (quizState.answers[i] === quiz.questions[i].correct ? "bg-emerald-500" : "bg-red-500") :
              "bg-muted"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-1.5">{labels.question} {quizState.current + 1} / {quiz.questions.length}</p>
      <h3 className="text-lg text-foreground font-semibold mb-5">{q.question}</h3>

      <div className="space-y-2.5 mb-5">
        {q.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = answered && i === q.correct;
          const isWrong = answered && isSelected && i !== q.correct;
          return (
            <motion.button
              key={i}
              whileHover={!answered ? { scale: 1.005 } : {}}
              whileTap={!answered ? { scale: 0.995 } : {}}
              disabled={answered}
              onClick={() => onSelectAnswer(i)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm ${
                isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" :
                isWrong ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400" :
                isSelected ? "bg-primary/10 border-primary/30 text-primary" :
                "bg-card border-border text-foreground hover:bg-muted/50 hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {isCorrect && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />}
                {isWrong && <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-5"
          >
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-blue-700 dark:text-blue-300 text-sm">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!answered ? (
        <Button className="w-full" disabled={selectedAnswer === null} onClick={onSubmitAnswer}>
          {labels.submit}
        </Button>
      ) : (
        <Button className="w-full" onClick={onNextQuestion}>
          {quizState.current < quiz.questions.length - 1 ? `${labels.question} ${quizState.current + 2} →` : labels.seeResults}
        </Button>
      )}
    </motion.div>
  );
}
