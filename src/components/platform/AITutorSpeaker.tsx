import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Square, SkipForward, Settings, Volume2, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AIAvatar from "@/components/portfolio/AIAvatar";

interface AITutorSpeakerProps {
  lessonTitle: string;
  lessonDescription: string;
  lessonContent: string;
  codeTemplate?: string;
  uiLanguage?: "en" | "fr" | "ar";
}

const tutorCopy = {
  en: {
    title: "AI Tutor",
    speaking: "Speaking...",
    paused: "Paused",
    complete: "Lesson complete",
    ready: "Click play to start",
    completeMessage: "Narration complete! Review the lesson content below.",
    idleMessage: "Press play and your AI tutor will explain this lesson step by step...",
    part: "Part",
    of: "of",
    readyShort: "Ready",
    stop: "Stop",
    pause: "Pause",
    resume: "Resume",
    play: "Play",
    skip: "Skip",
    settings: "Settings",
    speed: "Speed",
    voice: "Voice",
  },
  fr: {
    title: "Tuteur IA",
    speaking: "Lecture en cours...",
    paused: "En pause",
    complete: "Leçon terminée",
    ready: "Cliquez sur lecture pour commencer",
    completeMessage: "Narration terminée. Consultez maintenant le contenu de la leçon.",
    idleMessage: "Lancez la lecture et le tuteur IA expliquera cette leçon étape par étape...",
    part: "Partie",
    of: "sur",
    readyShort: "Prêt",
    stop: "Arrêter",
    pause: "Pause",
    resume: "Reprendre",
    play: "Lecture",
    skip: "Passer",
    settings: "Réglages",
    speed: "Vitesse",
    voice: "Voix",
  },
  ar: {
    title: "المعلم الذكي",
    speaking: "جاري الشرح...",
    paused: "متوقف مؤقتًا",
    complete: "اكتمل الدرس",
    ready: "اضغط تشغيل للبدء",
    completeMessage: "اكتمل السرد. راجع محتوى الدرس في الأسفل.",
    idleMessage: "اضغط تشغيل وسيشرح المعلم الذكي هذا الدرس خطوة بخطوة...",
    part: "الجزء",
    of: "من",
    readyShort: "جاهز",
    stop: "إيقاف",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    play: "تشغيل",
    skip: "تخطي",
    settings: "الإعدادات",
    speed: "السرعة",
    voice: "الصوت",
  },
} as const;

/* ── Helpers ── */
const cleanTextForSpeech = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, " ... code block omitted ... ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[🚀🎓💼💻🗺️☕🟨🐍🌐📚🏋️🛠️🌱🔧⚡🏆🧠✨🎉📊•]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ". ");

function buildNarrationSegments(title: string, description: string, content: string, codeTemplate?: string) {
  const segments: string[] = [];
  segments.push(`Lesson: ${title}. ${description}`);
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);
  for (const p of paragraphs) {
    segments.push(cleanTextForSpeech(p));
  }
  if (codeTemplate) {
    segments.push("Now, take a look at the code template in the editor below. Try to follow along and write the solution yourself.");
  }
  return segments;
}

/* ── Inline AI Tutor Speaker (embedded in lesson, replaces video placeholder) ── */
export default function AITutorSpeaker({ lessonTitle, lessonDescription, lessonContent, codeTemplate, uiLanguage = "en" }: AITutorSpeakerProps) {
  const ui = tutorCopy[uiLanguage] || tutorCopy.en;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [speechRate, setSpeechRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeText, setActiveText] = useState("");

  const segmentsRef = useRef<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Build segments when lesson changes
  useEffect(() => {
    segmentsRef.current = buildNarrationSegments(lessonTitle, lessonDescription, lessonContent, codeTemplate);
    setCurrentSegment(0);
    setProgress(0);
    setActiveText("");
    stopSpeaking();
  }, [lessonTitle, lessonDescription, lessonContent, codeTemplate]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices() || [];
      const english = v.filter(voice => voice.lang.startsWith("en"));
      setVoices(english.length > 0 ? english : v);
      if (selectedVoiceIdx === -1 && english.length > 0) {
        const preferred = english.findIndex(
          voice => voice.name.includes("Google") || voice.name.includes("Samantha") || voice.name.includes("Daniel")
        );
        setSelectedVoiceIdx(preferred >= 0 ? preferred : 0);
      }
    };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const speakSegment = useCallback((index: number) => {
    const segments = segmentsRef.current;
    if (!window.speechSynthesis || index >= segments.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(100);
      setActiveText("");
      return;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(segments[index]);
    u.rate = speechRate;
    u.pitch = 1;
    u.volume = 1;
    u.lang = "en-US";
    if (voices[selectedVoiceIdx]) u.voice = voices[selectedVoiceIdx];

    u.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentSegment(index);
      setActiveText(segments[index]);
      setProgress(Math.round(((index + 0.5) / segments.length) * 100));
    };
    u.onend = () => {
      setProgress(Math.round(((index + 1) / segments.length) * 100));
      if (index + 1 < segments.length) {
        speakSegment(index + 1);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
        setProgress(100);
        setActiveText("");
      }
    };
    u.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [speechRate, voices, selectedVoiceIdx]);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis?.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else if (isSpeaking) {
      window.speechSynthesis?.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    } else {
      speakSegment(progress >= 100 ? 0 : currentSegment);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setCurrentSegment(0);
    setProgress(0);
    setActiveText("");
  };

  const handleSkip = () => {
    const next = currentSegment + 1;
    if (next < segmentsRef.current.length) {
      speakSegment(next);
    } else {
      stopSpeaking();
      setProgress(100);
    }
  };

  const totalSegments = segmentsRef.current.length;
  const isActive = isSpeaking || isPaused;

  return (
    <div className="rounded-xl border bg-card border-border overflow-hidden">
      {/* Avatar + Narration area */}
      <div className="relative bg-gradient-to-br from-[#0f1117] via-[#151820] to-[#0f1117]">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5">
          {/* Full-body AI Avatar */}
          <div className="shrink-0 w-36 h-56 sm:w-44 sm:h-64 flex items-center justify-center">
            <AIAvatar isSpeaking={isSpeaking} isListening={false} size="full" />
          </div>

          {/* Narration panel */}
          <div className="flex-1 min-w-0 space-y-3 w-full">
            {/* Tutor label */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{ui.title}</p>
                <p className="text-[10px] text-gray-400">
                  {isSpeaking ? ui.speaking : isPaused ? ui.paused : progress >= 100 ? ui.complete : ui.ready}
                </p>
              </div>
            </div>

            {/* Current narration text (live subtitle) */}
            <div className="min-h-[60px] rounded-lg bg-white/5 border border-white/10 px-4 py-3">
              {activeText ? (
                <motion.p
                  key={currentSegment}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-200 leading-relaxed"
                >
                  {activeText}
                </motion.p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {progress >= 100
                    ? ui.completeMessage
                    : ui.idleMessage}
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>
                  {isActive
                    ? `${ui.part} ${currentSegment + 1} ${ui.of} ${totalSegments}`
                    : progress >= 100 ? ui.complete : ui.readyShort}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/15 bg-white/5 hover:bg-white/10 text-gray-300" onClick={handleStop} title={ui.stop}>
                <Square className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg shadow-primary/30"
                onClick={handlePlay}
                title={isSpeaking ? ui.pause : isPaused ? ui.resume : ui.play}
              >
                {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/15 bg-white/5 hover:bg-white/10 text-gray-300" onClick={handleSkip} title={ui.skip}>
                <SkipForward className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-200"
                onClick={() => setShowSettings(!showSettings)}
                title={ui.settings}
              >
                <Settings className={`w-3.5 h-3.5 transition-transform ${showSettings ? "rotate-90" : ""}`} />
              </Button>
            </div>

            {/* Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-3">
                    <div>
                      <label className="text-[10px] text-gray-400 font-medium block mb-1">
                        {ui.speed}: {speechRate.toFixed(1)}x
                      </label>
                      <input
                        type="range" min="0.5" max="2" step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
                        <span>0.5x</span><span>1.0x</span><span>2.0x</span>
                      </div>
                    </div>
                    {voices.length > 0 && (
                      <div>
                        <label className="text-[10px] text-gray-400 font-medium block mb-1">{ui.voice}</label>
                        <select
                          value={selectedVoiceIdx}
                          onChange={(e) => setSelectedVoiceIdx(parseInt(e.target.value))}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-200"
                        >
                          {voices.map((v, i) => (
                            <option key={i} value={i}>{v.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sound wave decoration at bottom */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-[3px] pb-1 pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-primary/40"
                animate={{ height: [4, 8 + Math.random() * 16, 4] }}
                transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
