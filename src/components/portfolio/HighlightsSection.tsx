import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import websummitStage from "@/assets/websummit-stage.jpg";
import websummitOutdoor from "@/assets/websummit-outdoor.jpg";
import workingCafe from "@/assets/working-cafe.jpg";
import bannerImg from "@/assets/banner.jpeg";
import profileImg from "@/assets/profile.jpg";
import bonialPortrait from "@/assets/bonial-portrait.jpeg";
import bonialStandup from "@/assets/bonial-standup-team.jpeg";
import bonialRemote from "@/assets/bonial-meeting-remote.jpeg";
import bonialIncident from "@/assets/bonial-incident-call.jpeg";
import bonialAws from "@/assets/bonial-aws-debugging.jpeg";
import bonialOffice from "@/assets/bonial-office-meeting.jpeg";
import { Camera, Building2 } from "lucide-react";
import { useLang } from "@/hooks/use-lang";

const conferenceHighlights = [
  { image: websummitStage, caption: "Presenting AI innovations at Web Summit Qatar 2025" },
  { image: websummitOutdoor, caption: "Networking with global tech leaders" },
  { image: bonialPortrait, caption: "Ready for action — Berlin, Germany" },
  { image: workingCafe, caption: "Building scalable solutions remotely" },
  { image: profileImg, caption: "Full-Stack Engineer — always shipping" },
];

const bonialHighlights = [
  { image: bonialStandup, caption: "Daily standup with the Planet Express team at Bonial" },
  { image: bonialOffice, caption: "In-person sprint planning at Bonial Tiergarten office" },
  { image: bonialAws, caption: "Debugging AWS RDS performance with the team" },
  { image: bonialIncident, caption: "Incident alignment call — rapid response culture" },
  { image: bonialRemote, caption: "Hybrid collaboration — remote + Berlin office" },
];

const HighlightsSection = () => {
  const { t } = useLang();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Conferences & Events */}
        <AnimatedSection>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
              <Camera size={12} className="text-primary" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">{t.highlights.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t.highlights.title}<span className="text-gradient">{t.highlights.titleHighlight}</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px] mb-20">
          {conferenceHighlights.map((item, i) => {
            const spans = [
              "col-span-2 row-span-2",
              "col-span-1 row-span-1",
              "col-span-1 row-span-2",
              "col-span-1 row-span-1",
              "col-span-2 md:col-span-1 row-span-1",
            ];
            return (
              <AnimatedSection key={i} delay={i * 0.08} className={spans[i]}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-border/30"
                >
                  <img src={item.image} alt={item.caption} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <p className="text-foreground text-sm font-medium">{item.caption}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bonial Work Culture */}
        <AnimatedSection>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
              <Building2 size={12} className="text-primary" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">Life at Bonial Germany</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Inside the <span className="text-gradient">Engineering Team</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              Daily standups, incident responses, AWS deep-dives, and hybrid collaboration — real engineering culture at Bonial's Berlin office.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {bonialHighlights.map((item, i) => {
            const spans = [
              "col-span-2 md:col-span-2 row-span-1",
              "col-span-1 row-span-2",
              "col-span-1 row-span-1",
              "col-span-1 row-span-1",
              "col-span-2 md:col-span-1 row-span-1",
            ];
            return (
              <AnimatedSection key={i} delay={i * 0.08} className={spans[i]}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-border/30"
                >
                  <img src={item.image} alt={item.caption} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {/* Always-visible label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                    <p className="text-foreground text-xs md:text-sm font-medium drop-shadow-sm">{item.caption}</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
