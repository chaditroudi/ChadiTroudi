import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import websummitStage from "@/assets/websummit-stage.jpg";
import websummitOutdoor from "@/assets/websummit-outdoor.jpg";
import workingCafe from "@/assets/working-cafe.jpg";
import bannerImg from "@/assets/banner.jpeg";
import profileImg from "@/assets/profile.jpg";
import { Camera } from "lucide-react";

const highlights = [
  { image: websummitStage, caption: "Presenting AI innovations at Web Summit Qatar 2025" },
  { image: websummitOutdoor, caption: "Networking with global tech leaders" },
  { image: bannerImg, caption: "Team collaboration at tech events" },
  { image: workingCafe, caption: "Building scalable solutions remotely" },
  { image: profileImg, caption: "Full-Stack Engineer — always shipping" },
];

const HighlightsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
              <Camera size={12} className="text-primary" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">Beyond the Code</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Moments & <span className="text-gradient">Highlights</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {highlights.map((item, i) => {
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
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <p className="text-foreground text-sm font-medium">{item.caption}</p>
                  </div>
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
