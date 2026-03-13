import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const AchievementsPage = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    const [achRes, earnedRes] = await Promise.all([
      supabase.from("achievements").select("*"),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", user!.id),
    ]);
    if (achRes.data) setAllAchievements(achRes.data as unknown as Achievement[]);
    if (earnedRes.data) setEarnedIds(new Set(earnedRes.data.map((e: any) => e.achievement_id)));
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  const earned = allAchievements.filter(a => earnedIds.has(a.id));
  const locked = allAchievements.filter(a => !earnedIds.has(a.id));

  return (
    <div className="bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h1 className="font-display font-bold text-foreground">Achievements</h1>
          <span className="text-sm text-muted-foreground ml-auto">{earned.length}/{allAchievements.length} earned</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {earned.length > 0 && (
          <>
            <h2 className="font-bold text-foreground mb-4">🏆 Earned</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {earned.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-5 text-center"
                >
                  <span className="text-3xl block mb-2">{a.icon}</span>
                  <h3 className="font-bold text-foreground text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <h2 className="font-bold text-foreground mb-4">🔒 Locked</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {locked.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-muted/20 border border-border/50 rounded-xl p-5 text-center opacity-50"
            >
              <span className="text-3xl block mb-2 grayscale">{a.icon}</span>
              <h3 className="font-bold text-foreground text-sm">{a.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AchievementsPage;
