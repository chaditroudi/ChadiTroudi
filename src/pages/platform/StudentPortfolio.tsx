import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Github, ExternalLink, Pencil, Trash2,
  X, Save, FolderOpen, Code2, Sparkles
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  screenshot_url: string | null;
  technologies: string[];
  created_at: string;
}

const emptyProject = {
  title: "",
  description: "",
  github_url: "",
  live_url: "",
  screenshot_url: "",
  technologies: "",
};

const StudentPortfolio = () => {
  const { user, loading, requireAuth, signOut } = usePlatformAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requireAuth();
  }, [loading, user]);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data } = await supabase
      .from("student_projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects((data as Project[]) || []);
    setLoadingProjects(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyProject);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      screenshot_url: p.screenshot_url || "",
      technologies: (p.technologies || []).join(", "),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !user) return;
    setSaving(true);
    const techs = form.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      github_url: form.github_url.trim() || null,
      live_url: form.live_url.trim() || null,
      screenshot_url: form.screenshot_url.trim() || null,
      technologies: techs,
      user_id: user.id,
    };

    if (editingId) {
      await supabase.from("student_projects").update(payload).eq("id", editingId);
    } else {
      await supabase.from("student_projects").insert(payload);
    }

    setShowForm(false);
    setForm(emptyProject);
    setEditingId(null);
    setSaving(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("student_projects").delete().eq("id", id);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold">My Portfolio</h1>
            </div>
          </div>
          <Button onClick={openAdd} size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Form overlay */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit Project" : "New Project"}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="text-white/60">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm text-white/60 mb-1 block">Title *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="My Awesome Project"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-white/60 mb-1 block">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What does this project do?"
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">GitHub URL</label>
                  <Input
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Live URL</label>
                  <Input
                    value={form.live_url}
                    onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                    placeholder="https://myproject.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Screenshot URL</label>
                  <Input
                    value={form.screenshot_url}
                    onChange={(e) => setForm({ ...form, screenshot_url: e.target.value })}
                    placeholder="https://i.imgur.com/..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Technologies (comma separated)</label>
                  <Input
                    value={form.technologies}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                    placeholder="React, TypeScript, Tailwind"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={handleSave} disabled={saving || !form.title.trim()} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Project"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project grid */}
        {loadingProjects ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Code2 className="w-6 h-6 text-indigo-400" />
            </motion.div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FolderOpen className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No projects yet</h3>
            <p className="text-white/40 mb-6">Showcase your coding journey by adding your first project!</p>
            <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
              <Plus className="w-4 h-4" /> Add Your First Project
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all"
              >
                {/* Screenshot */}
                {project.screenshot_url ? (
                  <div className="aspect-video bg-black/40 overflow-hidden">
                    <img
                      src={project.screenshot_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                    <Code2 className="w-10 h-10 text-white/20" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                  {project.description && (
                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{project.description}</p>
                  )}

                  {/* Tech badges */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-0 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Links + actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex gap-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                            <Github className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-indigo-400" onClick={() => openEdit(project)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentPortfolio;
