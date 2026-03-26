import { AlertTriangle, ExternalLink, FileText, GraduationCap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ImportantLinksSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-card to-accent/40 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1">
                  <AlertTriangle size={12} />
                  Important
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Important Documents</h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                  Recruiters can quickly review my professional profile and proof documents.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 w-full md:w-auto">
                <a
                  href="/ChadiTroudiCv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border/70 bg-background/70 px-4 py-3 hover:border-primary/35 hover:bg-accent/40 transition-all"
                >
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FileText size={15} className="text-primary" />
                    CV / Resume PDF
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Experience, projects, and core stack</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-primary mt-2">
                    Open
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </a>

                <a
                  href="/certif.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border/70 bg-background/70 px-4 py-3 hover:border-primary/35 hover:bg-accent/40 transition-all"
                >
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GraduationCap size={15} className="text-primary" />
                    Diploma & Certificates
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Education and certification proof</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-primary mt-2">
                    Open
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ImportantLinksSection;