import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { en, fr, ar, tn, LANGS, LANG_META, type TranslationKeys, type Lang } from "@/i18n";

export { LANGS, LANG_META };
export type { Lang };

const translations: Record<Lang, TranslationKeys> = { en, fr, ar, tn };

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
  dir: "ltr" | "rtl";
}

const DEFAULT_LANG: Lang = "en";
const STORAGE_KEY = "lang";

const isLang = (value: string | null): value is Lang => {
  return !!value && (LANGS as readonly string[]).includes(value);
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
  dir: "ltr",
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

  const dir = LANG_META[lang].dir;

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang],
      dir,
    }),
    [lang, dir]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};