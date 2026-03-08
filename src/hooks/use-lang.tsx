import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "tn";

const translations = {
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
    heroDesc: "Full-Stack Engineer specializing in scalable web applications using",
    javaSpring: "Java Spring Boot",
    react: "React",
    andMicroservices: ", and microservices. Building secure APIs and delivering enterprise solutions with",
    cleanArch: "clean architecture",
    viewMyWork: "View My Work",
    getInTouch: "Get In Touch",
    joinBootcamp: "Join My Java Bootcamp",
    newBadge: "New",
    bootcampDesc: "10-day intensive • Java + SQL + Project",
    currentlyAt: "Currently at",
    spotsLeft: "3 spots left →",
    years: "Years",
    companies: "Companies",
    projectsCount: "Projects",
    seniorEngineer: "Senior Full-Stack Engineer",

    // About
    aboutTitle: "About Me",
    aboutP1: "I'm a Full-Stack Engineer at",
    aboutP1b: ", building retail tech with React/TypeScript and Java Spring Boot. With 5+ years of experience, I've shipped products across banking, health, mobility, e-commerce, and education.",
    aboutP2: "At",
    aboutP2b: ", I represented the team at",
    aboutP2c: ", showcasing our AI work. I've led JS→TS migrations, created reusable React component libraries, and scaled backend services on AWS/Docker with CI/CD.",

    // Contact
    contactTitle: "Get In Touch",
    contactDesc: "I'm always open to discussing new opportunities, collaborations, or just chatting about tech.",
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
    heroDesc: "مهندس Full-Stack متخصص في تطبيقات الويب القابلة للتوسع باستخدام",
    javaSpring: "Java Spring Boot",
    react: "React",
    andMicroservices: "، و microservices. نبني APIs آمنة و حلول enterprise ب",
    cleanArch: "clean architecture",
    viewMyWork: "شوف خدمتي",
    getInTouch: "تواصل معايا",
    joinBootcamp: "سجّل في Java Bootcamp",
    newBadge: "جديد",
    bootcampDesc: "10 أيام مكثفة • Java + SQL + مشروع",
    currentlyAt: "نخدم في",
    spotsLeft: "3 بلايص باقيين ←",
    years: "سنين",
    companies: "شركات",
    projectsCount: "مشاريع",
    seniorEngineer: "مهندس Full-Stack أول",

    // About
    aboutTitle: "عليّا أنا",
    aboutP1: "أنا مهندس Full-Stack في",
    aboutP1b: "، نبني تكنولوجيا retail ب React/TypeScript و Java Spring Boot. عندي أكثر من 5 سنين خبرة، خدمت في مشاريع في البنوك، الصحة، النقل، التجارة الإلكترونية، و التعليم.",
    aboutP2: "في",
    aboutP2b: "، مثّلت الفريق في",
    aboutP2c: "، و عرضنا خدمتنا في AI. قدت migrations من JS ل TS، صنعت مكتبات React components، و كبّرت خدمات backend على AWS/Docker ب CI/CD.",

    // Contact
    contactTitle: "تواصل معايا",
    contactDesc: "ديما حاضر باش نحكي على فرص جداد، تعاونات، ولا نحكيو على التكنولوجيا.",
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

type Translations = typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Lang) || "en";
    }
    return "en";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
    // Keep LTR layout — the site is a portfolio, not a full RTL app
    document.documentElement.dir = "ltr";
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
};
