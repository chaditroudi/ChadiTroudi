import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export const LANGS = ["en", "tn"] as const;
export type Lang = (typeof LANGS)[number];

type TranslationSchema = {
  // Navbar
  about: string;
  projects: string;
  skills: string;
  experience: string;
  tutoring: string;
  blog: string;
  contact: string;
  resume: string;

  // Hero
  availableForHire: string;
  heroDesc: string;
  javaSpring: string;
  react: string;
  andMicroservices: string;
  cleanArch: string;
  viewMyWork: string;
  getInTouch: string;
  joinBootcamp: string;
  newBadge: string;
  bootcampDesc: string;
  bootcampPlatformCta: string;
  currentlyAt: string;
  spotsLeft: string;
  years: string;
  companies: string;
  projectsCount: string;
  seniorEngineer: string;

  // About
  aboutTitle: string;
  aboutP1: string;
  aboutP1b: string;
  aboutP2: string;
  aboutP2b: string;
  aboutP2c: string;

  // Contact
  contactTitle: string;
  contactDesc: string;
  sendMessage: string;
  yourName: string;
  yourEmail: string;
  message: string;

  // Skills
  skillsTitle: string;

  // Experience
  experienceTitle: string;

  // Tutoring
  tutoringTitle: string;

  // Blog
  blogTitle: string;

  // Footer
  builtWith: string;
  rights: string;

  // Testimonials
  testimonialsTitle: string;
};

const translations: Record<Lang, TranslationSchema> = {
  en: {
    // Navbar
    about: "About",
    projects: "Projects",
    skills: "Skills",
    experience: "Experience",
    tutoring: "Tutoring",
    blog: "Blog",
    contact: "Contact",
    resume: "Resume",

    // Hero
    availableForHire: "Available for hire",
    heroDesc:
      "Full-Stack Engineer specializing in scalable web applications using",
    javaSpring: "Java Spring Boot",
    react: "React",
    andMicroservices:
      ", and microservices. Building secure APIs and delivering enterprise solutions with",
    cleanArch: "clean architecture",
    viewMyWork: "View My Work",
    getInTouch: "Get In Touch",
    joinBootcamp: "Join My Java Bootcamp",
    newBadge: "New",
    bootcampDesc: "10-day intensive • Java + SQL + Project",
    bootcampPlatformCta:
      "Join the bootcamp platform with hands-on projects, real-world challenges, and expert mentorship.",
    currentlyAt: "Currently at",
    spotsLeft: "3 spots left →",
    years: "Years",
    companies: "Companies",
    projectsCount: "Projects",
    seniorEngineer: "Senior Full-Stack Engineer",

    // About
    aboutTitle: "About Me",
    aboutP1: "I'm a Full-Stack Engineer at",
    aboutP1b:
      ", building retail tech with React/TypeScript and Java Spring Boot. With 5+ years of experience, I've shipped products across banking, health, mobility, e-commerce, and education.",
    aboutP2: "At",
    aboutP2b: ", I represented the team at",
    aboutP2c:
      ", showcasing our AI work. I've led JS→TS migrations, created reusable React component libraries, and scaled backend services on AWS/Docker with CI/CD.",

    // Contact
    contactTitle: "Get In Touch",
    contactDesc:
      "I'm always open to discussing new opportunities, collaborations, or just chatting about tech.",
    sendMessage: "Send Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    message: "Message",

    // Skills
    skillsTitle: "Skills & Tools",

    // Experience
    experienceTitle: "Experience",

    // Tutoring
    tutoringTitle: "Java Tutoring",

    // Blog
    blogTitle: "Blog & Articles",

    // Footer
    builtWith: "Built with",
    rights: "All rights reserved.",

    // Testimonials
    testimonialsTitle: "Testimonials",
  },

  tn: {
    // Navbar
    about: "عليّا",
    projects: "المشاريع",
    skills: "المهارات",
    experience: "الخبرة",
    tutoring: "تدريس",
    blog: "المقالات",
    contact: "اتصل بيّا",
    resume: "CV",

    // Hero
    availableForHire: "متاح للخدمة",
    heroDesc:
      "مهندس Full-Stack متخصص في تطبيقات الويب القابلة للتوسع باستخدام",
    javaSpring: "Java Spring Boot",
    react: "React",
    andMicroservices: "، و microservices. نبني APIs آمنة و حلول enterprise ب",
    cleanArch: "clean architecture",
    viewMyWork: "شوف خدمتي",
    getInTouch: "تواصل معايا",
    joinBootcamp: "سجّل في Java Bootcamp",
    newBadge: "جديد",
    bootcampDesc: "10 أيام مكثفة • Java + SQL + مشروع",
    bootcampPlatformCta:
      "إلتحق بمنصة الـBootcamp: مشاريع تطبيقية، تحديات من الواقع، ومرافقة من خبراء.",
    currentlyAt: "نخدم في",
    spotsLeft: "3 بلايص باقيين ←",
    years: "سنين",
    companies: "شركات",
    projectsCount: "مشاريع",
    seniorEngineer: "مهندس Full-Stack أول",

    // About
    aboutTitle: "عليّا أنا",
    aboutP1: "أنا مهندس Full-Stack في",
    aboutP1b:
      "، نبني تكنولوجيا retail ب React/TypeScript و Java Spring Boot. عندي أكثر من 5 سنين خبرة، خدمت في مشاريع في البنوك، الصحة، النقل، التجارة الإلكترونية، و التعليم.",
    aboutP2: "في",
    aboutP2b: "، مثّلت الفريق في",
    aboutP2c:
      "، و عرضنا خدمتنا في AI. قدت migrations من JS ل TS، صنعت مكتبات React components، و كبّرت خدمات backend على AWS/Docker ب CI/CD.",

    // Contact
    contactTitle: "تواصل معايا",
    contactDesc:
      "ديما حاضر باش نحكي على فرص جداد، تعاونات، ولا نحكيو على التكنولوجيا.",
    sendMessage: "ابعث الرسالة",
    yourName: "اسمك",
    yourEmail: "الإيمايل متاعك",
    message: "الرسالة",

    // Skills
    skillsTitle: "المهارات و الأدوات",

    // Experience
    experienceTitle: "الخبرة المهنية",

    // Tutoring
    tutoringTitle: "تدريس Java",

    // Blog
    blogTitle: "المقالات",

    // Footer
    builtWith: "مصنوع ب",
    rights: "كل الحقوق محفوظة.",

    // Testimonials
    testimonialsTitle: "شهادات",
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationSchema;
}

const DEFAULT_LANG: Lang = "en";
const STORAGE_KEY = "lang";

const isLang = (value: string | null): value is Lang => {
  return !!value && LANGS.includes(value as Lang);
};

const getInitialLang = (): Lang => {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const savedLang = localStorage.getItem(STORAGE_KEY);
  return isLang(savedLang) ? savedLang : DEFAULT_LANG;
};

const LangContext = createContext<LangContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: translations[DEFAULT_LANG],
});

export const useLang = () => useContext(LangContext);

interface LangProviderProps {
  children: ReactNode;
}

export const LangProvider = ({ children }: LangProviderProps) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, nextLang);
    }
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang],
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};