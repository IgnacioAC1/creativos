import { Link, useNavigate } from "react-router";
import { ArrowUpRight, Plus, Eye, Pencil } from "lucide-react";
import { courses } from "../data";
import Nav from "../components/figma/Nav";
import Footer from "../components/figma/Footer";
import StateDisplay from "../components/StateDisplay";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const myCourses = courses.filter((c) => c.profesorSlug === user?.profesorSlug);

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <Nav />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8 mb-14">
            <div>
              <span
                className="text-xs text-accent tracking-widest uppercase block mb-3"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Área de profesor
              </span>
              <h1
                style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(28px, 4vw, 52px)" }}
                className="font-light text-foreground"
              >
                {user?.name}
              </h1>
            </div>
            <Link
              to="/profesor/cursos/nuevo"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 transition-colors flex-shrink-0"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Plus size={14} />
              Nuevo curso
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <StateDisplay
              state="empty"
              title="Sin cursos aún"
              description="Comienza creando tu primer curso para compartir tu expertise con estudiantes."
              action={{
                label: "Crear primer curso",
                onClick: () => navigate("/profesor/cursos/nuevo"),
              }}
            />
          ) : (
            <div className="flex flex-col gap-0 border border-border">
              {myCourses.map((course, i) => (
                <div
                  key={course.slug}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 ${
                    i < myCourses.length - 1 ? "border-b border-border" : ""
                  } hover:bg-secondary/30 transition-colors`}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <img
                      src={course.image}
                      alt={course.alt}
                      className="w-16 h-12 object-cover grayscale flex-shrink-0 hidden sm:block"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs text-muted-foreground uppercase tracking-widest"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {course.code}
                        </span>
                        <span
                          className={`text-xs uppercase tracking-widest px-2 py-0.5 ${
                            course.published
                              ? "bg-accent/20 text-accent"
                              : "bg-secondary text-muted-foreground"
                          }`}
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {course.published ? "Publicado" : "Borrador"}
                        </span>
                      </div>
                      <h3
                        style={{ fontFamily: "'Krona One', sans-serif" }}
                        className="text-base font-light text-foreground truncate"
                      >
                        {course.title}
                      </h3>
                      <p
                        className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {course.lessons} lecciones · {course.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/cursos/${course.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground px-4 py-2 transition-all"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <Eye size={12} />
                      Ver
                    </Link>
                    <Link
                      to={`/profesor/cursos/${course.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-accent text-muted-foreground hover:text-accent px-4 py-2 transition-all"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <Pencil size={12} />
                      Editar
                      <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
