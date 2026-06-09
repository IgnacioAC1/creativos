import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PasswordInput from "../components/PasswordInput";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "alumno" } },
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSubmitted(true);
    setTimeout(() => navigate("/login"), 2000);
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
          {submitted ? (
            <div className="text-center">
              <span
                className="text-xs text-accent tracking-widest uppercase block mb-4"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ¡Listo!
              </span>
              <h1
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-3xl font-light text-foreground mb-4"
              >
                Cuenta creada
              </h1>
              <p className="text-sm text-muted-foreground">Redirigiendo al login…</p>
            </div>
          ) : (
            <>
              <span
                className="text-xs text-accent tracking-widest uppercase block mb-4"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Nueva cuenta
              </span>
              <h1
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-4xl font-light text-foreground mb-10"
              >
                Empieza hoy
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>

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
                    placeholder="Mínimo 6 caracteres"
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
                  {submitting ? "Creando cuenta…" : "Crear cuenta"}
                </button>
              </form>

              <p className="text-sm text-muted-foreground mt-8 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-foreground hover:text-accent transition-colors">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
