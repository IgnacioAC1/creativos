import { Link, useNavigate } from "react-router";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import { courses } from "../data";
import Nav from "../components/figma/Nav";
import Footer from "../components/figma/Footer";
import StateDisplay from "../components/StateDisplay";
import { useAuth } from "../context/AuthContext";

const PROGRESS_KEY = "ac_progress";

function loadProgress(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progress = loadProgress();

  const enrolledCourses = courses.filter((c) => user?.enrolledCourses.includes(c.slug));

  function getCourseProgress(slug: string) {
    const course = courses.find((c) => c.slug === slug);
    if (!course) return { completed: 0, total: 0, pct: 0 };
    const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completed = (progress[slug] ?? []).length;
    return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  const activeCourses = enrolledCourses.filter((c) => getCourseProgress(c.slug).pct < 100);
  const completedCourses = enrolledCourses.filter((c) => getCourseProgress(c.slug).pct === 100);

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <Nav />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16 md:py-24">
          <div className="border-b border-border pb-8 mb-14">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Mi espacio
            </span>
            <h1
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(28px, 4vw, 52px)" }}
              className="font-light text-foreground"
            >
              Hola, {user?.name}
            </h1>
          </div>

          {enrolledCourses.length === 0 ? (
            <StateDisplay
              state="empty"
              title="Aún no tienes cursos"
              description="Explora nuestro catálogo de cursos y comienza tu formación en diseño gráfico."
              action={{
                label: "Explorar cursos",
                onClick: () => navigate("/cursos"),
              }}
            />
          ) : (
            <>
              {activeCourses.length > 0 && (
                <section className="mb-16">
                  <h2
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-xl font-light text-foreground mb-8"
                  >
                    En progreso
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCourses.map((course) => {
                      const { completed, total, pct } = getCourseProgress(course.slug);
                      return (
                        <Link
                          key={course.slug}
                          to={`/cursos/${course.slug}`}
                          className="group bg-card border border-border hover:border-accent/40 transition-colors overflow-hidden flex flex-col"
                        >
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={course.image}
                              alt={course.alt}
                              className="w-full h-full object-cover opacity-50 grayscale transition-all duration-500 group-hover:opacity-70 group-hover:grayscale-0"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <span
                              className="text-xs text-muted-foreground uppercase tracking-widest mb-2"
                              style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                              {course.code} · {course.level}
                            </span>
                            <h3
                              style={{ fontFamily: "'Krona One', sans-serif" }}
                              className="text-lg font-light text-foreground mb-4 group-hover:text-accent transition-colors"
                            >
                              {course.title}
                            </h3>

                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className="text-xs text-muted-foreground uppercase tracking-widest"
                                  style={{ fontFamily: "'DM Mono', monospace" }}
                                >
                                  {completed}/{total} lecciones
                                </span>
                                <span
                                  className="text-xs text-accent"
                                  style={{ fontFamily: "'DM Mono', monospace" }}
                                >
                                  {pct}%
                                </span>
                              </div>
                              <div className="w-full h-0.5 bg-border">
                                <div
                                  className="h-0.5 bg-accent transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {completedCourses.length > 0 && (
                <section>
                  <h2
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-xl font-light text-foreground mb-8"
                  >
                    Completados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedCourses.map((course) => (
                      <Link
                        key={course.slug}
                        to={`/cursos/${course.slug}`}
                        className="group bg-card border border-border hover:border-accent/40 transition-colors overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[16/9] overflow-hidden relative">
                          <img
                            src={course.image}
                            alt={course.alt}
                            className="w-full h-full object-cover opacity-30 grayscale"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle size={40} className="text-accent" />
                          </div>
                        </div>
                        <div className="p-6">
                          <span
                            className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {course.code} · Completado
                          </span>
                          <h3
                            style={{ fontFamily: "'Krona One', sans-serif" }}
                            className="text-lg font-light text-foreground group-hover:text-accent transition-colors"
                          >
                            {course.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
