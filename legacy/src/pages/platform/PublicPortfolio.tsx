import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Github, ExternalLink, Code2, User, Sparkles, Globe, ArrowLeft
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  screenshot_url: string | null;
  technologies: string[];
}

interface Profile {
  display_name: string;
  avatar_url: string | null;
  portfolio_bio: string | null;
  total_xp: number;
  current_level: number;
  streak_days: number;
}

const PublicPortfolio = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("student_profiles")
        .select("display_name, avatar_url, portfolio_bio, total_xp, current_level, streak_days")
        .eq("user_id", userId)
        .eq("portfolio_public", true)
        .maybeSingle();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData as Profile);

      const { data: projectsData } = await supabase
        .from("student_projects")
        .select("id, title, description, github_url, live_url, screenshot_url, technologies")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setProjects((projectsData as Project[]) || []);
      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Portfolio Not Found</h1>
          <p className="text-white/50 mb-6">This portfolio doesn't exist or is set to private.</p>
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 relative z-10 text-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-indigo-500/30 overflow-hidden"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent"
          >
            {profile?.display_name}
          </motion.h1>

          {profile?.portfolio_bio && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-lg max-w-xl mx-auto mb-8"
            >
              {profile.portfolio_bio}
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">{profile?.total_xp || 0}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Lv. {profile?.current_level || 1}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{profile?.streak_days || 0}🔥</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{projects.length}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Projects</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Projects */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-indigo-400" /> Projects
        </h2>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No projects yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300"
              >
                {project.screenshot_url ? (
                  <div className="aspect-video bg-black/40 overflow-hidden">
                    <img
                      src={project.screenshot_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
                    <Code2 className="w-10 h-10 text-white/15" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-white/50 text-sm mb-4 leading-relaxed">{project.description}</p>
                  )}

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-0 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-white/5">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                        <Github className="w-4 h-4" /> Code
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-white/30 text-sm">
        Built with ChadiAcademy Platform
      </footer>
    </div>
  );
};

export default PublicPortfolio;
