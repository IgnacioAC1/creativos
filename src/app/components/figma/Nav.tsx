import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";

const ROLE_HOME = {
  admin: "/admin",
  profesor: "/profesor",
  alumno: "/alumno",
};

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  }

  const startHref = isAuthenticated ? ROLE_HOME[user!.role] : "/registro";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "border-b border-border/0"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <Link
              to="/"
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-2xl font-light tracking-tight text-foreground hover:text-accent transition-colors leading-none"
            >
              AcademiaCreativa
            </Link>
            <span
              className="text-[9px] uppercase"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.4em", color: "#9E9B96", fontWeight: 500 }}
            >
              Escuela de Diseño Gráfico
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/cursos"
              className="text-[10px] uppercase hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500, color: "var(--foreground)" }}
            >
              Cursos
            </Link>
            <Link
              to="/eventos"
              className="text-[10px] uppercase hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500, color: "var(--foreground)" }}
            >
              Eventos
            </Link>
            <a
              href={isHome ? "#metodología" : "/#metodología"}
              className="text-[10px] uppercase hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500, color: "var(--foreground)" }}
            >
              Metodología
            </a>
            <a
              href={isHome ? "#claustro" : "/#claustro"}
              className="text-[10px] uppercase hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500, color: "var(--foreground)" }}
            >
              Claustro
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 transition-colors duration-200 ${theme === "dark" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Modo oscuro"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 transition-colors duration-200 ${theme === "light" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Modo claro"
              >
                <Sun size={13} />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-[10px] uppercase border border-border hover:border-accent hover:text-accent transition-all duration-200 px-4 py-2.5"
                  style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500, color: "var(--foreground)" }}
                >
                  <User size={12} />
                  {user!.name.split(" ")[0]}
                  <ChevronDown size={11} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-background border border-border z-50 flex flex-col"
                    >
                      <Link
                        to={ROLE_HOME[user!.role]}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors uppercase tracking-widest border-b border-border"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        <LayoutDashboard size={12} />
                        Mi espacio
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-colors uppercase tracking-widest"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        <LogOut size={12} />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to={startHref}
                className="inline-flex items-center gap-2 text-[10px] uppercase border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 px-5 py-2.5"
                style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.3em", fontWeight: 500 }}
              >
                Empezar ahora
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 transition-colors duration-200 ${theme === "dark" ? "text-foreground" : "text-muted-foreground"}`}
                aria-label="Modo oscuro"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 transition-colors duration-200 ${theme === "light" ? "text-foreground" : "text-muted-foreground"}`}
                aria-label="Modo claro"
              >
                <Sun size={13} />
              </button>
            </div>
            <button
              className="text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-24 px-8"
          >
            {[
              { label: "Cursos", to: "/cursos", isLink: true },
              { label: "Eventos", to: "/eventos", isLink: true },
              { label: "Metodología", to: isHome ? "#metodología" : "/#metodología", isLink: false },
              { label: "Claustro", to: isHome ? "#claustro" : "/#claustro", isLink: false },
            ].map((item, i) => (
              item.isLink ? (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={item.to}
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="block text-5xl font-light py-5 border-b border-border text-foreground hover:text-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="block text-5xl font-light py-5 border-b border-border text-foreground hover:text-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              )
            ))}

            {isAuthenticated ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4 * 0.07 }}
                >
                  <Link
                    to={ROLE_HOME[user!.role]}
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="block text-5xl font-light py-5 border-b border-border text-foreground hover:text-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mi espacio
                  </Link>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 5 * 0.07 }}
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="text-left text-5xl font-light py-5 border-b border-border text-muted-foreground hover:text-accent transition-colors"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  Salir
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 4 * 0.07 }}
              >
                <Link
                  to="/registro"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="block text-5xl font-light py-5 border-b border-border text-foreground hover:text-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Empezar ahora
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
