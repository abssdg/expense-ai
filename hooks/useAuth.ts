import { supabase } from "@/lib/supabase";
import { seedDefaultCategoriesIfNeeded } from "@/services/categoryService";
import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleSession = async (currentSession: Session | null) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        try {
          await seedDefaultCategoriesIfNeeded();
        } catch (error) {
          console.log("Seed default categories error:", error);
        }
      }

      if (mounted) {
        setLoadingAuth(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      handleSession(currentSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isLogin: !!session,
    loadingAuth,
  };
}
