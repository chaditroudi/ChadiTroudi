// ─── Arabic Translations (العربية الفصحى) ───
import type { TranslationKeys } from "./en";

const ar: TranslationKeys = {
  // ─── Navbar ───
  nav: {
    home: "الرئيسية",
    about: "حول",
    projects: "المشاريع",
    skills: "المهارات",
    experience: "الخبرات",
    tutoring: "الدروس",
    pricing: "الأسعار",
    docs: "الوثائق",
    blog: "المدونة",
    contact: "اتصل بي",
    platform: "المنصة",
    resume: "السيرة الذاتية",
    toggleLang: "تبديل اللغة",
  },

  // ─── Hero ───
  hero: {
    availableForHire: "متاح للتوظيف",
    desc: "مهندس Full-Stack متخصص في بناء تطبيقات ويب قابلة للتوسع باستخدام",
    javaSpring: "Java Spring Boot",
    react: "React",
    andMicroservices: "، والخدمات المصغّرة. بناء واجهات برمجية آمنة وتقديم حلول مؤسسية بـ",
    cleanArch: "هندسة نظيفة",
    viewMyWork: "شاهد أعمالي",
    getInTouch: "تواصل معي",
    joinBootcamp: "انضم إلى معسكر Java",
    newBadge: "جديد",
    bootcampDesc: "معسكر مكثف 10 أيام • Java + SQL + مشروع",
    bootcampPlatformCta: "انضم لمنصة المعسكر مع مشاريع عملية، تحديات واقعية، وإرشاد خبراء.",
    currentlyAt: "حالياً في",
    spotsLeft: "3 أماكن متبقية ←",
    years: "سنوات",
    companies: "شركات",
    projectsCount: "مشاريع",
    seniorEngineer: "مهندس Full-Stack أول",
  },

  // ─── About ───
  about: {
    title: "نبذة عني",
    p1: "أنا مهندس Full-Stack في",
    p1b: "، أبني حلول تقنية للتجارة باستخدام React/TypeScript و Java Spring Boot. بخبرة تتجاوز 5 سنوات، طوّرت منتجات في قطاعات البنوك والصحة والنقل والتجارة الإلكترونية والتعليم.",
    p2: "في",
    p2b: "، مثّلت الفريق في",
    p2c: "، لعرض أعمالنا في الذكاء الاصطناعي. قدت عمليات الانتقال من JS إلى TS، وأنشأت مكتبات مكونات React قابلة لإعادة الاستخدام، ووسّعت خدمات الخلفية على AWS/Docker مع CI/CD.",
  },

  // ─── Stats ───
  stats: {
    yearsExp: "سنوات الخبرة",
    projectsDelivered: "مشاريع منجزة",
    industriesServed: "قطاعات خُدمت",
    clientSatisfaction: "رضا العملاء",
  },

  // ─── Skills ───
  skills: {
    title: "المهارات والخبرات",
    frontend: "الواجهة الأمامية",
    backend: "الواجهة الخلفية",
    devops: "DevOps والأدوات",
  },

  // ─── Experience ───
  experience: {
    title: "الخبرات المهنية",
  },

  // ─── Projects ───
  projects: {
    title: "أعمال مميزة",
  },

  // ─── Contact ───
  contact: {
    title: "تواصل معي",
    greeting: "لنبنِ شيئاً",
    greetingHighlight: "معاً",
    desc: "أنا منفتح على الفرص الجديدة والمشاريع المتكاملة والتعاون المثير. أرسل لي رسالة.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    namePlaceholder: "اسمك",
    emailPlaceholder: "you@example.com",
    subjectPlaceholder: "استفسار عن مشروع",
    messagePlaceholder: "أخبرني عن مشروعك…",
    optional: "(اختياري)",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    toastTitle: "يتم فتح عميل البريد الإلكتروني…",
    toastDesc: "تم ملء تفاصيل رسالتك مسبقاً.",
    nameRequired: "الاسم مطلوب",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "البريد الإلكتروني غير صحيح",
    messageRequired: "الرسالة مطلوبة",
  },

  // ─── Blog ───
  blog: {
    title: "المدونة والمقالات",
    readMore: "اقرأ المزيد",
    minRead: "دقائق للقراءة",
  },

  // ─── Tutoring ───
  tutoring: {
    title: "دروس Java",
  },

  // ─── Pricing / Subscription ───
  pricing: {
    starter: "مبتدئ",
    pro: "احترافي",
    bootcamp: "معسكر",
    month: "/شهر",
    oneTime: "مرة واحدة",
    popular: "الأكثر شعبية",
    getStarted: "ابدأ الآن",
    features: {
      aiTutor: "الوصول إلى مدرّس الذكاء الاصطناعي",
      challengeEvals: "10 تقييمات تحدي/يوم",
      basicAnalysis: "تحليل كود أساسي",
      communitySupport: "دعم المجتمع",
      emailSupport: "دعم بالبريد الإلكتروني",
      everythingStarter: "كل ما في خطة المبتدئ",
      unlimitedEvals: "تقييمات تحدي غير محدودة",
      advancedDebug: "مساعدة تصحيح أخطاء متقدمة",
      weeklySession: "جلسة أسبوعية فردية (30 دقيقة)",
      prioritySupport: "دعم ذو أولوية",
      customPath: "مسار تعلم مخصص",
      intensive: "برنامج Java مكثف 10 أيام",
      javaSql: "Java + SQL + مشروع حقيقي",
      dailySessions: "جلسات فردية يومية",
      codeReview: "مراجعة الكود وإرشاد",
      certificate: "شهادة إتمام",
      lifetimeAccess: "وصول مدى الحياة للمجتمع",
      jobPrep: "دعم التحضير للعمل",
    },
  },

  // ─── Highlights ───
  highlights: {
    badge: "ما وراء الكود",
    title: "لحظات و",
    titleHighlight: "إبرازات",
  },

  // ─── Testimonials ───
  testimonials: {
    title: "آراء العملاء",
  },

  // ─── Footer ───
  footer: {
    desc: "مهندس Full-Stack يبني تطبيقات ويب قابلة للتوسع باستخدام Java و React وتقنيات السحاب.",
    explore: "اكتشف",
    learn: "تعلّم",
    connect: "تواصل",
    howItWorks: "كيف يعمل",
    builtWith: "بُني بـ",
    inTunisia: "في تونس.",
    rights: "جميع الحقوق محفوظة.",
  },

  // ─── Platform ───
  platform: {
    dashboard: "لوحة التحكم",
    worldMap: "خريطة العالم",
    learningPath: "مسار التعلم",
    sharpenSkills: "شحذ المهارات",
    achievements: "الإنجازات",
    playground: "ملعب الكود",
    aiCourses: "دورات الذكاء الاصطناعي",
    interviewCoach: "مدرب المقابلات",
    debugDetective: "محقق الأخطاء",
    logout: "تسجيل الخروج",
    welcome: "مرحباً بعودتك",
    continuelearning: "أكمل التعلم",
    quickActions: "إجراءات سريعة",
    yourJourney: "رحلتك في المعسكر",
    viewAll: "عرض الكل",
    open: "فتح",
    level: "المستوى",
    xp: "نقاط الخبرة",
    streak: "سلسلة",
    daysStreak: "يوم متتالي",

    worldMapDesc: "استكشف الجزر وتغلب على تحديات البرمجة",
    continueDesc: "أكمل من حيث توقفت",
    sharpenDesc: "تحديات وتقدم وإتقان المهارات",
    achievementsDesc: "شارات مكتسبة",
    playgroundDesc: "اكتب الكود وشغّله واحصل على ملاحظات الذكاء الاصطناعي",
    aiCoursesDesc: "أنشئ دورات تعلم إلكتروني من محتواك",
    interviewDesc: "تدرّب على مقابلات البرمجة وتصميم الأنظمة والسلوكيات",
    debugDesc: "اكتشف الأخطاء في أكواد معطّلة تحت الضغط",
    aiAssistant: "المساعد الذكي",
    aiAssistantDesc: "مدربك الشخصي بالذكاء الاصطناعي — دردش، تعلم، تدرّب",
    studentHelp: "مساعدة الطلاب",
    studentHelpDesc: "ساعد زملاءك واحصل على إجابات وتعاون",
    courses: "الدورات",
    coursesDesc: "دورات منظمة مع دروس واختبارات وتمارين",
    resources: "الموارد",
    resourcesDesc: "ملفات PDF وملاحظات وجلسات مسجلة",
  },

  // ─── Page Headers ───
  pages: {
    projectsTitle: "أعمال مميزة",
    projectsSubtitle: "مجموعة مختارة من المشاريع التي بنيتها — من منصات الذكاء الاصطناعي إلى أنظمة البيع بالتجزئة على نطاق المؤسسات، كل منها يحل مشاكل حقيقية.",
    skillsTitle: "المهارات والخبرة",
    skillsSubtitle: "أكثر من 5 سنوات في بناء تطبيقات full-stack عبر الواجهة الأمامية والخلفية وDevOps — مع تركيز عميق على Java وReact والبنية التحتية السحابية.",
    tutoringTitle: "تعلّم وتدرّب",
    tutoringSubtitle: "معسكرات مكثفة يقدّمها مهندسون كبار من أفضل شركات التقنية في برلين. اختر من 4 مسارات مهنية — Java أو Cloud/DevOps أو الشبكات أو Linux — وانتقل من مبتدئ إلى جاهز للعمل.",
    pricingTitle: "خطط الاشتراك",
    pricingSubtitle: "خطط مرنة مصممة للسوق التونسي — تعلّم البرمجة مع تدريس بالذكاء الاصطناعي، طرق دفع محلية، وإرشاد حقيقي.",
    blogTitle: "المدونة والمقالات",
    blogSubtitle: "مقالات تقنية، نصائح مهنية، ودروس من الميدان — مشاركة المعرفة من بناء أنظمة إنتاج على نطاق واسع.",
    contactTitle: "تواصل معي",
    contactSubtitle: "أنا دائماً منفتح على مناقشة الفرص الجديدة والمشاريع المتكاملة والتعاون المثير.",
  },

  // ─── 404 ───
  notFound: {
    title: "404",
    subtitle: "عذراً! الصفحة غير موجودة",
    returnHome: "العودة للرئيسية",
  },

  // ─── Auth ───
  auth: {
    signIn: "تسجيل الدخول",
    signInSubtitle: "مرحباً بعودتك! أدخل بياناتك للمتابعة.",
    signUp: "إنشاء حساب",
    signUpSubtitle: "ابدأ مجاناً. لا حاجة لبطاقة ائتمان.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "اسمك الكامل",
    signingIn: "جارٍ تسجيل الدخول…",
    creatingAccount: "جارٍ إنشاء الحساب…",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    signUpLink: "إنشاء حساب",
    signInLink: "تسجيل الدخول",
    welcomeBack: "مرحباً بعودتك!",
    accountCreated: "تم إنشاء الحساب!",
    levelUp: "طوّر",
    engineeringSkills: "مهاراتك الهندسية",
    joinPlatform: "انضم لمنصة المعسكر مع مشاريع عملية، تحديات واقعية، وإرشاد خبراء.",
  },

  // ─── Common ───
  common: {
    home: "الرئيسية",
    loading: "جارٍ التحميل…",
    backToHome: "العودة للرئيسية",
  },
} as const;

export default ar;
