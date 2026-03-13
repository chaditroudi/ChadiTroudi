import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, Sparkles, Loader2, AlertCircle,
  FileImage, ClipboardPaste, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAIAssistant } from "../hooks/use-ai-assistant";
import { ToolResultRenderer } from "./AIResultCards";
import { AIAvatar } from "../avatar/AIAvatar";
import type { AIToolResult } from "../types";

// ─── PDF text extraction using pdf.js from CDN ───
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168";
let pdfjsLoaded = false;

async function loadPdfJs() {
  if (pdfjsLoaded) return;
  if ((window as any).pdfjsLib) { pdfjsLoaded = true; return; }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${PDFJS_CDN}/pdf.min.mjs`;
    script.type = "module";

    // For module scripts, we need a different approach
    const inlineScript = document.createElement("script");
    inlineScript.textContent = `
      import("${PDFJS_CDN}/pdf.min.mjs").then(mod => {
        window.pdfjsLib = mod;
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "${PDFJS_CDN}/pdf.worker.min.mjs";
        window.dispatchEvent(new Event("pdfjsReady"));
      }).catch(err => {
        window.dispatchEvent(new CustomEvent("pdfjsError", { detail: err }));
      });
    `;
    inlineScript.type = "module";

    const onReady = () => {
      pdfjsLoaded = true;
      cleanup();
      resolve();
    };
    const onError = (e: Event) => {
      cleanup();
      reject((e as CustomEvent).detail || new Error("Failed to load pdf.js"));
    };
    const cleanup = () => {
      window.removeEventListener("pdfjsReady", onReady);
      window.removeEventListener("pdfjsError", onError);
    };

    window.addEventListener("pdfjsReady", onReady);
    window.addEventListener("pdfjsError", onError);
    document.head.appendChild(inlineScript);
  });
}

async function extractTextFromPdf(file: File): Promise<string> {
  await loadPdfJs();
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) throw new Error("pdf.js not available");

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(" ");
    if (text.trim()) pages.push(text);
  }

  return pages.join("\n\n");
}

// ─── Component ───
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  text: string;
}

export const ExerciseSolver = () => {
  const { generateTool, isDemoMode } = useAIAssistant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [manualText, setManualText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIToolResult | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");
    setResult(null);

    if (file.type === "application/pdf") {
      setExtracting(true);
      try {
        const text = await extractTextFromPdf(file);
        if (!text.trim()) {
          setError("Could not extract text from this PDF. It might be image-based. Try pasting the text manually.");
          setExtracting(false);
          return;
        }
        setUploadedFile({ name: file.name, size: file.size, type: file.type, text });
      } catch (err) {
        setError("Failed to read PDF. Try pasting the exercise text manually instead.");
      }
      setExtracting(false);
    } else if (file.type.startsWith("text/")) {
      const text = await file.text();
      setUploadedFile({ name: file.name, size: file.size, type: file.type, text });
    } else {
      setError("Unsupported file type. Please upload a PDF or text file, or paste the exercise text below.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  }, [handleFileSelect]);

  const clearFile = () => {
    setUploadedFile(null);
    setError("");
    setResult(null);
  };

  const getExerciseText = (): string => {
    return uploadedFile?.text || manualText.trim();
  };

  const handleSolve = async () => {
    const text = getExerciseText();
    if (!text) return;

    setSolving(true);
    setError("");

    const prompt = `Solve the following exercise/exam completely. Provide a detailed solution for EVERY question found in the text.\n\n--- EXERCISE TEXT ---\n${text}\n--- END ---\n\nReturn the full solution as exercise_solution JSON.`;

    const res = await generateTool("exercise_solution", prompt);
    if (res) {
      setResult(res);
    } else {
      setError("Could not generate a solution. Please try again or rephrase the exercise.");
    }
    setSolving(false);
  };

  const hasText = !!getExerciseText();

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {!uploadedFile && !result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/40 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Drop your exercise PDF here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse — supports PDF and text files
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] gap-1">
                  <FileText className="w-3 h-3" /> PDF
                </Badge>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <FileText className="w-3 h-3" /> TXT
                </Badge>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or paste text</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Manual text input */}
          <div>
            <Textarea
              placeholder="Paste your exercise or exam questions here..."
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              rows={6}
              className="resize-none text-sm"
            />
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <ClipboardPaste className="w-3 h-3" />
              Paste from Word, Google Docs, or any text source
            </p>
          </div>
        </motion.div>
      )}

      {/* Extracting state */}
      {extracting && (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Reading PDF...</p>
        </div>
      )}

      {/* Uploaded file preview */}
      {uploadedFile && !result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                {uploadedFile.type === "application/pdf" ? (
                  <FileText className="w-5 h-5 text-emerald-500" />
                ) : (
                  <FileImage className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{uploadedFile.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.text.length.toLocaleString()} characters extracted
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={clearFile}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Text preview */}
          <div className="bg-muted/40 rounded-lg p-3 max-h-40 overflow-y-auto mb-4">
            <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
              {uploadedFile.text.slice(0, 600)}{uploadedFile.text.length > 600 ? "..." : ""}
            </p>
          </div>
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solve button */}
      {hasText && !result && !solving && (
        <Button
          onClick={handleSolve}
          className="w-full gap-2"
          size="lg"
        >
          <Sparkles className="w-4 h-4" />
          Solve Exercise — Get Full Solution
        </Button>
      )}

      {/* Solving state */}
      {solving && (
        <div className="flex flex-col items-center py-10">
          <AIAvatar size="md" showWaves={true} />
          <p className="text-sm text-muted-foreground mt-4 animate-pulse">
            Analyzing and solving your exercise...
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {isDemoMode ? "Demo mode — showing sample solution" : "AI is working on a complete solution"}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolResultRenderer result={result} />
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => { setResult(null); clearFile(); setManualText(""); }} className="gap-1">
              <Trash2 className="w-3 h-3" /> New Exercise
            </Button>
            <Button variant="outline" size="sm" onClick={handleSolve} className="gap-1">
              <Sparkles className="w-3 h-3" /> Re-solve
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
