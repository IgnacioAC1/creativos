import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PasswordInput from "../components/PasswordInput";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setSubmitting(false);
      setError("Email o contraseña incorrectos.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setSubmitting(false);

    const roleHome: Record<string, string> = {
      admin: "/admin",
      profesor: "/profesor",
      alumno: "/alumno",
    };

    navigate(roleHome[profile?.role ?? ""] ?? "/");
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <header className="border-b border-border px-8 md:px-12 py-5">
        <Link
          to="/"
          style={{ fontFamily: "'Krona One', sans-serif" }}
          className="text-2xl font-light text-foreground hover:text-accent transition-colors"
        >
          AcademiaCreativa
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <span
            className="text-xs text-accent tracking-widest uppercase block mb-4"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Acceso
          </span>
          <h1
            style={{ fontFamily: "'Krona One', sans-serif" }}
            className="text-4xl font-light text-foreground mb-10"
          >
            Inicia sesión
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                className="text-xs uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Contraseña
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                required
              />
            </div>

            {error && (
              <p
                className="text-xs text-accent"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors mt-2 disabled:opacity-60"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {submitting ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-foreground hover:text-accent transition-colors">
              Crear cuenta
            </Link>
          </p>

          <div className="mt-10 border-t border-border pt-8">
            <p
              className="text-xs text-muted-foreground mb-3 uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Cuentas de prueba
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
              <span>admin@academiacreativa.com / admin123</span>
              <span>marta@academiacreativa.com / profe123</span>
              <span>alumno@test.com / alumno123</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
