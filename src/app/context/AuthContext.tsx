import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";

export type Role = "admin" | "profesor" | "alumno";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profesorSlug?: string;
  enrolledCourses: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  isEnrolled: (courseSlug: string) => boolean;
  updateName: (name: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function buildAuthUser(userId: string, email: string): Promise<AuthUser | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, role, profesor_slug")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_slug")
    .eq("user_id", userId);

  const enrolledCourses = (enrollments ?? [])
    .map((e: { course_slug: string }) => e.course_slug)
    .filter(Boolean) as string[];

  return {
    id: userId,
    name: profile.name,
    email,
    role: profile.role as Role,
    profesorSlug: profile.profesor_slug ?? undefined,
    enrolledCourses,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // defer DB calls to avoid Supabase onAuthStateChange deadlock
        setTimeout(async () => {
          if (!mounted) return;
          if (session?.user) {
            const authUser = await buildAuthUser(session.user.id, session.user.email!);
            if (mounted) {
              setUser(authUser);
              setLoading(false);
            }
          } else {
            setUser(null);
            setLoading(false);
          }
        }, 0);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  function isEnrolled(courseSlug: string): boolean {
    return user?.enrolledCourses.includes(courseSlug) ?? false;
  }

  async function updateName(name: string): Promise<string | null> {
    if (!user) return "No hay sesión activa";
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);
    if (error) return error.message;
    setUser((prev) => (prev ? { ...prev, name } : prev));
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, isEnrolled, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
