import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Flame, Trophy, LogOut, Map, Code2, MapPin, Swords,
  Menu, LayoutDashboard, ChevronsLeft, ChevronsRight, Wand2, GraduationCap, Bug, Sparkles, Users, BookOpen, FolderOpen, Globe, /* CreditCard, */
} from "lucide-react";
import { useLang, LANGS, LANG_META } from "@/hooks/use-lang";
import { TrialBanner, TokenBalanceWidget } from "@/components/platform/SaasGate";
import { AIFloatingWidget } from "@/features/ai-assistant/components/AIFloatingWidget";
import level1Avatar from "@/assets/avatars/level-1-recruit.png";
import level2Avatar from "@/assets/avatars/level-2-junior.png";
import level3Avatar from "@/assets/avatars/level-3-explorer.png";
import level4Avatar from "@/assets/avatars/level-4-specialist.png";
import level5Avatar from "@/assets/avatars/level-5-builder.png";
import level6Avatar from "@/assets/avatars/level-6-ai-apprentice.png";
import level7Avatar from "@/assets/avatars/level-7-ai-engineer.png";
import level8Avatar from "@/assets/avatars/level-8-master.png";

const levelAvatars: Record<number, string> = {
  1: level1Avatar,
  2: level2Avatar,
  3: level3Avatar,
  4: level4Avatar,
  5: level5Avatar,
  6: level6Avatar,
  7: level7Avatar,
  8: level8Avatar,
};

interface SidebarProfile {
  display_name: string;
  current_level: number;
  total_xp: number;
  streak_days: number;
}

interface SidebarLevel {
  number: number;
  title: string;
  required_xp: number;
}

const PlatformLayout = () => {
  const { user, loading, requireAuth, signOut } = usePlatformAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [levels, setLevels] = useState<SidebarLevel[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { to: "/platform/dashboard", icon: LayoutDashboard, label: t.platform.dashboard },
    { to: "/platform/world-map", icon: MapPin, label: t.platform.worldMap },
    { to: "/platform/learn", icon: Map, label: t.platform.learningPath },
    { to: "/platform/sharpen", icon: Swords, label: t.platform.sharpenSkills },
    { to: "/platform/achievements", icon: Trophy, label: t.platform.achievements },
    { to: "/platform/playground", icon: Code2, label: t.platform.playground },
    { to: "/platform/ai-courses", icon: Wand2, label: t.platform.aiCourses },
    { to: "/platform/interview", icon: GraduationCap, label: t.platform.interviewCoach },
    { to: "/platform/debug", icon: Bug, label: t.platform.debugDetective },
    { to: "/platform/ai-assistant", icon: Sparkles, label: t.platform.aiAssistant },
    { to: "/platform/student-help", icon: Users, label: t.platform.studentHelp },
    { to: "/platform/courses", icon: BookOpen, label: t.platform.courses },
    { to: "/platform/resources", icon: FolderOpen, label: t.platform.resources },
    // { to: "/platform/billing", icon: CreditCard, label: "Billing" },
  ];

  useEffect(() => {
    requireAuth();
  }, [loading, user]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLevels([]);
      return;
    }
    loadSidebarData();
  }, [user?.id]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const loadSidebarData = async () => {
    if (!user) return;

    const [profileRes, levelsRes] = await Promise.all([
      supabase
        .from("student_profiles")
        .select("display_name, current_level, total_xp, streak_days, onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("platform_levels").select("number, title, required_xp").order("number"),
    ]);

    if (profileRes.data && !(profileRes.data as any).onboarding_completed) {
      navigate("/platform/onboarding");
      return;
    }

    if (profileRes.data) setProfile(profileRes.data as unknown as SidebarProfile);
    if (levelsRes.data) setLevels(levelsRes.data as unknown as SidebarLevel[]);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const currentLevel = levels.find(l => l.number === profile.current_level);
  const nextLevel = levels.find(l => l.number === profile.current_level + 1);
  const xpProgress = nextLevel
    ? ((profile.total_xp - (currentLevel?.required_xp || 0)) / (nextLevel.required_xp - (currentLevel?.required_xp || 0))) * 100
    : 100;

  /* ─── Sidebar content (shared between desktop & mobile sheet) ─── */
  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2">
        <Link to="/" className="font-display font-bold text-lg text-foreground flex items-center gap-1 min-w-0">
          <span className="text-primary text-xl">{'<'}</span>
          {!collapsed && (
            <span className="truncate">
              Code<span className="text-primary">Camp</span>
              <span className="text-primary">{'/>'}</span>
            </span>
          )}
          {collapsed && <span className="text-primary text-xl">{'/>'}</span>}
        </Link>
      </div>

      {/* Avatar + XP mini card */}
      <div className={`px-3 mb-4 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 ${collapsed ? "p-2" : "p-3"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="relative shrink-0">
              <div className={`${collapsed ? "w-10 h-10" : "w-12 h-12"} rounded-xl overflow-hidden border-2 border-primary/30`}>
                <img src={levelAvatars[profile.current_level] || level1Avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-card border border-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-primary">
                {profile.current_level}
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{profile.display_name || "Coder"}</p>
                <p className="text-[11px] text-muted-foreground">{currentLevel?.title}</p>
                <div className="mt-1.5">
                  <Progress value={Math.min(xpProgress, 100)} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-0.5">{profile.total_xp} / {nextLevel?.required_xp || "MAX"} XP</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!collapsed && <TrialBanner />}

      {/* Nav links */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== "/platform/dashboard" && location.pathname.startsWith(item.to));
          const linkContent = (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <item.icon className={`shrink-0 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return <div key={item.to}>{linkContent}</div>;
        })}
      </nav>

      {!collapsed && <TokenBalanceWidget />}

      {/* Streak widget */}
      {!collapsed && (
        <div className="px-3 pb-3 space-y-2">
          <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-3 flex items-center gap-3">
            <div className="bg-orange-500/20 rounded-lg p-2">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{profile.streak_days}-{t.platform.daysStreak}</p>
              <p className="text-[10px] text-muted-foreground">Keep it going!</p>
            </div>
          </div>
        </div>
      )}

      {/* Language switcher */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>{LANG_META[lang].flag} {LANG_META[lang].label}</span>
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                      l === lang
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span className="text-base">{LANG_META[l].flag}</span>
                    <span>{LANG_META[l].label}</span>
                    {l === lang && <span className="ml-auto text-primary text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {collapsed && (
        <div className="px-2 pb-2 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  const idx = LANGS.indexOf(lang);
                  setLang(LANGS[(idx + 1) % LANGS.length]);
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                <Globe className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{LANG_META[lang].label}</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Sign out */}
      <div className={`border-t border-border px-3 py-3 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t.platform.logout}</TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground hover:text-destructive gap-2">
            <LogOut className="w-4 h-4" /> {t.platform.logout}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex overflow-hidden bg-background">
        {/* ─── Desktop Sidebar ─── */}
        <aside
          className={`hidden md:flex flex-col shrink-0 bg-card border-r border-border transition-all duration-300 ${
            sidebarCollapsed ? "w-[68px]" : "w-60"
          } relative`}
        >
          <SidebarContent collapsed={sidebarCollapsed} />
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            className="absolute -right-3 top-7 z-50 bg-card border border-border rounded-full p-1 shadow-sm hover:bg-muted transition-colors"
          >
            {sidebarCollapsed ? <ChevronsRight className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronsLeft className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </aside>

        {/* ─── Main content column ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ─── Mobile Top Bar ─── */}
          <header className="md:hidden shrink-0 bg-card/90 backdrop-blur-md border-b border-border z-40">
            <div className="flex items-center justify-between px-4 py-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <Link to="/" className="font-display font-bold text-foreground">
                <span className="text-primary">{'<'}</span>CodeCamp<span className="text-primary">{'/>'}</span>
              </Link>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-bold">{profile.streak_days}</span>
              </div>
            </div>
          </header>

          {/* ─── Scrollable content ─── */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>

          {/* ─── AI Floating Widget ─── */}
          <AIFloatingWidget />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PlatformLayout;
