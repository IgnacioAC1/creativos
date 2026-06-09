import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { courses } from "../data";
import Nav from "../components/figma/Nav";
import Footer from "../components/figma/Footer";

export default function CoursesPage() {
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
              Formación
            </span>
            <h1
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(36px, 5vw, 72px)" }}
              className="font-light text-foreground leading-tight"
            >
              Todos los cursos
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {courses.filter((c) => c.published).map((course, i) => {
              const isWide = i % 2 === 0;
              return (
                <Link
                  key={course.code}
                  to={`/cursos/${course.slug}`}
                  className={`group ${isWide ? "md:col-span-7" : "md:col-span-5"} bg-card border border-border hover:border-accent/40 transition-colors duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={course.image}
                      alt={course.alt}
                      className="w-full h-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span
                        className="text-xs tracking-widest uppercase px-3 py-1.5 bg-background/80 backdrop-blur-sm text-muted-foreground"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {course.code}
                      </span>
                      <span
                        className="text-xs tracking-widest uppercase px-3 py-1.5 bg-accent text-accent-foreground"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div
                      className="flex items-center gap-4 text-xs text-muted-foreground tracking-widest uppercase mb-4"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <span>{course.lessons} lecciones</span>
                      <span>{course.hours}</span>
                    </div>
                    <h2
                      style={{ fontFamily: "'Krona One', sans-serif" }}
                      className="text-2xl font-light text-card-foreground mb-3 group-hover:text-accent transition-colors duration-200"
                    >
                      {course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
                      <span
                        className="text-lg text-card-foreground"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {course.price}
                      </span>
                      <span
                        className="group/btn inline-flex items-center gap-2 text-xs tracking-widest uppercase border border-foreground/20 group-hover:border-accent group-hover:text-accent px-4 py-2.5 transition-all duration-200"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        Ver curso
                        <ArrowUpRight
                          size={12}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
