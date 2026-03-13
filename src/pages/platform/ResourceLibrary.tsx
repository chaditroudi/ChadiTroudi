import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, ExternalLink, BookOpen, FolderOpen } from "lucide-react";
import { resources, resourceTypeConfig, getCourseById } from "@/data/courses-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", ...new Set(resources.map(r => r.category))];
const types = ["All", "pdf", "notes", "recording"] as const;

export default function ResourceLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState<string>("All");

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || r.category === category;
      const matchType = type === "All" || r.type === type;
      return matchSearch && matchCat && matchType;
    });
  }, [search, category, type]);

  const counts = {
    pdf: resources.filter(r => r.type === "pdf").length,
    notes: resources.filter(r => r.type === "notes").length,
    recording: resources.filter(r => r.type === "recording").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Resource Library</h1>
            <p className="text-muted-foreground text-sm mt-0.5">PDFs, notes, and recorded sessions — everything you need to study and review.</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
        {Object.entries(counts).map(([key, val], i) => {
          const conf = resourceTypeConfig[key as keyof typeof resourceTypeConfig];
          const colors = [
            "from-red-500/10 to-red-500/5 border-red-500/20",
            "from-blue-500/10 to-blue-500/5 border-blue-500/20",
            "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
          ];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className={`bg-gradient-to-br ${colors[i]} border rounded-xl p-4 text-center`}
            >
              <span className="text-lg">{conf.icon}</span>
              <p className="text-xl font-bold text-foreground">{val}</p>
              <p className="text-[10px] text-muted-foreground">{conf.label}s</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs value={category} onValueChange={setCategory} className="flex-1">
            <TabsList className="flex-wrap h-auto gap-1">
              {categories.map(c => (
                <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs value={type} onValueChange={setType}>
            <TabsList className="h-auto gap-1">
              {types.map(t => {
                const conf = t !== "All" ? resourceTypeConfig[t] : null;
                return (
                  <TabsTrigger key={t} value={t} className="text-xs gap-1">
                    {conf && <span className="text-xs">{conf.icon}</span>}
                    {t === "All" ? "All" : conf?.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Resource Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource, idx) => {
          const conf = resourceTypeConfig[resource.type];
          const linkedCourse = resource.courseId ? getCourseById(resource.courseId) : null;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + idx * 0.06 }}
              whileHover={{ y: -3 }}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
            >
              {/* Type badge */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {conf.icon} {conf.label}
                </Badge>
                <span className="text-muted-foreground text-[10px]">{resource.size}</span>
              </div>

              <h3 className="text-foreground font-semibold text-sm mb-1">{resource.title}</h3>
              <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{resource.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-normal">{tag}</Badge>
                ))}
              </div>

              {/* Linked Course */}
              {linkedCourse && (
                <div className="flex items-center gap-1.5 mb-3 text-[11px] text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  <span>From: {linkedCourse.title}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground text-[10px]">{resource.dateAdded}</span>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold mb-1">No resources match your filters.</p>
          <Button variant="link" size="sm" onClick={() => { setSearch(""); setCategory("All"); setType("All"); }}>
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
