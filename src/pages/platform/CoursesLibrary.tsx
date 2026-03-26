import { useState, useMemo, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, Layers, ChevronRight, GraduationCap, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses, difficultyConfig } from "@/data/courses-data";
import { useLang } from "@/hooks/use-lang";

const categories = ["All", ...new Set(courses.map(c => c.category))];

const colorMap: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
  amber:   { gradient: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20 hover:border-amber-500/40", text: "text-amber-500", iconBg: "bg-amber-500/15" },
  blue:    { gradient: "from-blue-500/10 to-cyan-500/5", border: "border-blue-500/20 hover:border-blue-500/40", text: "text-blue-500", iconBg: "bg-blue-500/15" },
  violet:  { gradient: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/20 hover:border-violet-500/40", text: "text-violet-500", iconBg: "bg-violet-500/15" },
  emerald: { gradient: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/20 hover:border-emerald-500/40", text: "text-emerald-500", iconBg: "bg-emerald-500/15" },
};

const statStyles = {
  blue: { card: "from-blue-500/10 to-blue-500/5", icon: "text-blue-500" },
  violet: { card: "from-violet-500/10 to-violet-500/5", icon: "text-violet-500" },
  emerald: { card: "from-emerald-500/10 to-emerald-500/5", icon: "text-emerald-500" },
  amber: { card: "from-amber-500/10 to-amber-500/5", icon: "text-amber-500" },
} as const;

const libraryCopy = {
  en: {
    title: "Course library",
    subtitle: "Structured learning paths with lessons, exercises, and quizzes",
    totalCourses: "Total courses",
    modules: "Modules",
    lessons: "Lessons",
    hours: "Hours",
    search: "Search courses, tags...",
    allLevels: "All levels",
    noCourses: "No courses found",
    tryFilters: "Try adjusting your search or filters",
    clear: "Clear filters",
    progress: "Progress",
    start: "Start course",
  },
  fr: {
    title: "Bibliothèque des cours",
    subtitle: "Parcours structurés avec leçons, exercices et quiz",
    totalCourses: "Total des cours",
    modules: "Modules",
    lessons: "Leçons",
    hours: "Heures",
    search: "Rechercher un cours ou un tag...",
    allLevels: "Tous niveaux",
    noCourses: "Aucun cours trouvé",
    tryFilters: "Essayez d'ajuster la recherche ou les filtres",
    clear: "Effacer les filtres",
    progress: "Progression",
    start: "Commencer",
  },
  ar: {
    title: "مكتبة المقررات",
    subtitle: "مسارات تعلم منظمة تضم دروسًا وتمارين واختبارات",
    totalCourses: "إجمالي المقررات",
    modules: "الوحدات",
    lessons: "الدروس",
    hours: "الساعات",
    search: "ابحث عن مقرر أو وسم...",
    allLevels: "كل المستويات",
    noCourses: "لم يتم العثور على مقررات",
    tryFilters: "جرّب تعديل البحث أو الفلاتر",
    clear: "مسح الفلاتر",
    progress: "التقدم",
    start: "ابدأ المقرر",
  },
} as const;

export default function CoursesLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("all");
  const deferredSearch = useDeferredValue(search);
  const { lang, dir } = useLang();
  const uiLang = lang === "fr" || lang === "ar" ? lang : "en";
  const ui = libraryCopy[uiLang];

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const normalizedSearch = deferredSearch.toLowerCase();
      const matchSearch = normalizedSearch === "" || c.title.toLowerCase().includes(normalizedSearch) ||
        c.description.toLowerCase().includes(normalizedSearch) ||
        c.tags.some(t => t.toLowerCase().includes(normalizedSearch));
      const matchCat = category === "All" || c.category === category;
      const matchDiff = difficulty === "all" || c.difficulty === difficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [deferredSearch, category, difficulty]);

  const totalLessons = courses.reduce((acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0);
  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const totalHours = courses.reduce((acc, c) => acc + c.estimatedHours, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6" dir={dir}>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              {ui.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">{ui.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-blue-600 border-blue-500/20 bg-blue-500/10">
              <BookOpen className="w-3 h-3" /> {courses.length} {ui.totalCourses}
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-violet-600 border-violet-500/20 bg-violet-500/10">
              <Sparkles className="w-3 h-3" /> {totalHours}h Content
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: ui.totalCourses, value: courses.length, color: "blue" },
          { icon: Layers, label: ui.modules, value: totalModules, color: "violet" },
          { icon: GraduationCap, label: ui.lessons, value: totalLessons, color: "emerald" },
          { icon: Clock, label: ui.hours, value: `${totalHours}h`, color: "amber" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            className={`bg-gradient-to-br ${statStyles[stat.color as keyof typeof statStyles].card} border border-border rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-background/60 p-1.5">
                <stat.icon className={`w-4 h-4 ${statStyles[stat.color as keyof typeof statStyles].icon}`} />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row gap-3 items-start md:items-center"
      >
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={ui.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/30 border-border"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-muted/50 h-9">
            {categories.map(c => (
              <TabsTrigger key={c} value={c} className="text-xs px-3">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={difficulty} onValueChange={setDifficulty}>
          <TabsList className="bg-muted/50 h-9">
            <TabsTrigger value="all" className="text-xs px-3">{ui.allLevels}</TabsTrigger>
            <TabsTrigger value="beginner" className="text-xs px-3">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" className="text-xs px-3">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs px-3">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Course Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((course, idx) => {
          const lessonCount = course.modules.reduce((a, m) => a + m.lessons.length, 0);
          const c = colorMap[course.color];
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <Link to={`/platform/courses/${course.id}`} className="block h-full">
                <div className={`bg-gradient-to-br ${c.gradient} border ${c.border} rounded-xl p-5 h-full transition-all group`}>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${c.iconBg} rounded-xl p-2.5 w-fit`}>
                      <span className="text-2xl">{course.icon}</span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold ${difficultyConfig[course.difficulty].color} ${difficultyConfig[course.difficulty].bg} border-transparent`}>
                      {difficultyConfig[course.difficulty].label}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {course.modules.length} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {lessonCount} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.estimatedHours}h
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{tag}</Badge>
                    ))}
                  </div>

                  {/* Progress placeholder */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>{ui.progress}</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>

                  <span className={`${c.text} text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    {ui.start} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold mb-1">{ui.noCourses}</p>
          <p className="text-muted-foreground text-sm mb-4">{ui.tryFilters}</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("All"); setDifficulty("all"); }}>
            {ui.clear}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
