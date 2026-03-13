import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, CheckCircle2, XCircle, Lightbulb, Star, Trophy, Code2 } from "lucide-react";
import { getCourseById, getModuleById, getLessonById, lessonTypeConfig } from "@/data/courses-data";
import type { Quiz, QuizQuestion } from "@/data/courses-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function CourseLessonViewer() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>();
  const navigate = useNavigate();

  const course = getCourseById(courseId || "");
  const module_ = getModuleById(courseId || "", moduleId || "");
  const lesson = getLessonById(courseId || "", moduleId || "", lessonId || "");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState<{ current: number; answers: (number | null)[]; submitted: boolean }>({ current: 0, answers: [], submitted: false });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!course || !module_ || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Code2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground font-semibold mb-1">Lesson not found</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/platform/courses")}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to courses
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-5">
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
          <span>Module progress</span>
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

          {/* Content Area */}
          <motion.div
            key={`content-${lesson.id}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-xl border bg-card border-border overflow-hidden"
          >
            {/* Video */}
            {lesson.type === "video" && (
              <div>
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-7 h-7 text-primary-foreground ml-0.5" />
                  </motion.button>
                  <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">Video Placeholder</span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-primary" /> Lesson Notes
                  </h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{lesson.content}</div>
                </div>
              </div>
            )}

            {/* Slides */}
            {lesson.type === "slides" && lesson.slides && (
              <div>
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
                <div className="p-5">
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{lesson.content}</div>
                </div>
              </div>
            )}

            {/* Interactive */}
            {lesson.type === "interactive" && (
              <div>
                <div className="p-5 border-b border-border">
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{lesson.content}</div>
                </div>
                {lesson.codeTemplate && (
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">Interactive Editor</span>
                    </div>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs">
                      <code className="text-emerald-600 dark:text-emerald-400">{lesson.codeTemplate}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Exercise */}
            {lesson.type === "exercise" && (
              <div>
                <div className="p-5 border-b border-border">
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{lesson.content}</div>
                </div>
                {lesson.codeTemplate && (
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">Exercise Workspace</span>
                    </div>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs">
                      <code className="text-blue-600 dark:text-blue-400">{lesson.codeTemplate}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* XP Badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex justify-center">
            <Badge variant="outline" className="gap-1.5 text-yellow-600 border-yellow-500/20 bg-yellow-500/10">
              <Star className="w-3 h-3" /> +{lesson.xpReward} XP on completion
            </Badge>
          </motion.div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-between pt-2">
            {prevLesson ? (
              <Button variant="outline" size="sm" onClick={() => { goToLesson(prevLesson.id); setCurrentSlide(0); }}>
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>
            ) : <div />}

            {nextLesson ? (
              <Button size="sm" onClick={() => { goToLesson(nextLesson.id); setCurrentSlide(0); }}>
                Next Lesson <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button size="sm" className="gap-1.5" onClick={startQuiz}>
                <Trophy className="w-3.5 h-3.5" /> Take Module Quiz
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
  quiz, quizState, selectedAnswer, showExplanation, quizScore, quizPercent, passed,
  onSelectAnswer, onSubmitAnswer, onNextQuestion, onRetry, onExit, onFinish,
}: {
  quiz: Quiz;
  quizState: { current: number; answers: (number | null)[]; submitted: boolean };
  selectedAnswer: number | null;
  showExplanation: boolean;
  quizScore: number;
  quizPercent: number;
  passed: boolean;
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
        <h2 className="text-2xl font-bold text-foreground mb-1.5">{passed ? "Quiz Passed!" : "Not Quite..."}</h2>
        <p className="text-muted-foreground text-sm mb-6">
          You scored {quizScore}/{quiz.questions.length} ({quizPercent}%) — {passed ? `+${quiz.xpReward} XP!` : `Need ${quiz.passingScore}% to pass`}
        </p>
        <div className="w-48 mx-auto mb-8">
          <Progress value={quizPercent} className="h-2.5" />
        </div>
        <div className="flex justify-center gap-3">
          {!passed && (
            <Button variant="default" onClick={onRetry}>Retry Quiz</Button>
          )}
          <Button variant="outline" onClick={onFinish}>Back to Course</Button>
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
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onExit}>Exit Quiz</Button>
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

      <p className="text-xs text-muted-foreground mb-1.5">Question {quizState.current + 1} of {quiz.questions.length}</p>
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
          Submit Answer
        </Button>
      ) : (
        <Button className="w-full" onClick={onNextQuestion}>
          {quizState.current < quiz.questions.length - 1 ? "Next Question →" : "See Results"}
        </Button>
      )}
    </motion.div>
  );
}
