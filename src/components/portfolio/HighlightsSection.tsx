import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import websummitStage from "@/assets/websummit-stage.jpg";
import websummitOutdoor from "@/assets/websummit-outdoor.jpg";
import workingCafe from "@/assets/working-cafe.jpg";

const highlights = [
  {
    image: websummitStage,
    title: "Web Summit Qatar 2025",
    description: "Represented Yanyi at one of the world's largest tech conferences, showcasing AI innovations.",
    tag: "Conference",
  },
  {
    image: websummitOutdoor,
    title: "Networking & Collaboration",
    description: "Connecting with global tech leaders and exploring cutting-edge innovations at Web Summit.",
    tag: "Networking",
  },
  {
    image: workingCafe,
    title: "Remote Engineering",
    description: "Building scalable full-stack solutions from anywhere — focused, productive, and always shipping.",
    tag: "Lifestyle",
  },
];

const HighlightsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="container mx-auto px-6 max-w-5xl">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-primary font-mono text-sm tracking-wider mb-2">Beyond the Code</p>
            <h2 className="text-2xl md:text-3xl font-bold">Highlights & Moments</h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group rounded-xl overflow-hidden glass h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-mono px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
