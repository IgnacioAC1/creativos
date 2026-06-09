import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronRight, Video } from "lucide-react";
import { useNavigate } from "react-router";
import { courses } from "../../data";
import { useAuth } from "../../context/AuthContext";

export default function Courses() {
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section id="cursos" className="py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="flex items-end justify-between mb-14 border-b border-border pb-8">
          <div>
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              02 / Cursos
            </span>
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-4xl md:text-5xl font-light text-foreground"
            >
              Aprende con vídeo
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-right leading-relaxed">
            Acceso de por vida. Aprende cuando quieras, tantas veces como necesites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {courses.map((c, idx) => {
            const isOpen = openCourse === c.code;
            const isLarge = idx % 3 === 0;
            return (
              <div
                key={c.code}
                className={`${isLarge ? "md:col-span-7" : "md:col-span-5"} group relative overflow-hidden bg-secondary cursor-pointer`}
                onClick={() => setOpenCourse(isOpen ? null : c.code)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5">
                    <Video size={12} className="text-accent" />
                    <span
                      className="text-xs text-foreground tracking-widest uppercase"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {c.lessons} lecciones · {c.hours}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-xs text-accent tracking-widest uppercase"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {c.code}
                        </span>
                        <span
                          className="text-xs text-muted-foreground tracking-widest uppercase"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {c.level}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <h3
                          style={{ fontFamily: "'Krona One', sans-serif" }}
                          className="text-2xl font-light text-card-foreground group-hover:text-accent transition-colors duration-200"
                        >
                          {c.title}
                        </h3>
                        <span
                          style={{ fontFamily: "'Krona One', sans-serif" }}
                          className="text-2xl font-light text-card-foreground ml-4 flex-shrink-0"
                        >
                          {c.price}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                          {c.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {c.topics.map((t) => (
                            <div
                              key={t}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                              style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                              <span className="text-accent">→</span>
                              {t}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(isAuthenticated ? `/cursos/${c.slug}` : "/registro"); }}
                            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase bg-accent text-accent-foreground px-5 py-3 hover:bg-accent/90 transition-colors"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            Acceder al curso
                            <ArrowUpRight size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cursos/${c.slug}`); }}
                            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            Ver temario completo
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
