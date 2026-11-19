import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Check admin role
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("role", "admin");

          setIsAuthenticated(roles && roles.length > 0 ? true : false);
        } else {
          setIsAuthenticated(false);
        }
        setChecking(false);
      }
    );

    // Also check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("role", "admin");
        setIsAuthenticated(roles && roles.length > 0 ? true : false);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard />
  ) : (
    <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  );
};

export default Admin;
