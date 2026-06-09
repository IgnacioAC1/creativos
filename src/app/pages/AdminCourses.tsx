import { useState } from "react";
import { Link } from "react-router";
import { Eye, Pencil, Plus } from "lucide-react";
import { courses as initialCourses, type Course } from "../data";
import Nav from "../components/figma/Nav";
import StateDisplay from "../components/StateDisplay";
import { AdminNav } from "./AdminDashboard";

export default function AdminCourses() {
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);

  function togglePublished(slug: string) {
    setCourseList((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, published: !c.published } : c))
    );
  }

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <Nav />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8 mb-12">
            <div>
              <span
                className="text-xs text-accent tracking-widest uppercase block mb-3"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Administración
              </span>
              <h1
                style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(24px, 3vw, 44px)" }}
                className="font-light text-foreground"
              >
                Gestión de cursos
              </h1>
            </div>
            <Link
              to="/admin/cursos/nuevo"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 transition-colors flex-shrink-0"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Plus size={14} />
              Nuevo curso
            </Link>
          </div>

          <AdminNav active="/admin/cursos" />

          <div className="border border-border">
            <div
              className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="col-span-1">Código</span>
              <span className="col-span-4">Título</span>
              <span className="col-span-2">Nivel</span>
              <span className="col-span-1">Precio</span>
              <span className="col-span-2">Estado</span>
              <span className="col-span-2 text-right">Acciones</span>
            </div>

            {courseList.length === 0 ? (
              <div className="px-6 py-16">
                <StateDisplay
                  state="empty"
                  title="Sin cursos aún"
                  description="Comienza creando un curso para hacer disponible contenido educativo."
                  action={{
                    label: "Crear primer curso",
                    onClick: () => {},
                  }}
                />
              </div>
            ) : null}
            {courseList.map((course, i) => (
              <div
                key={course.slug}
                className={`grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-0 px-6 py-4 ${
                  i < courseList.length - 1 ? "border-b border-border" : ""
                } hover:bg-secondary/30 transition-colors`}
              >
                <span
                  className="md:col-span-1 text-xs text-muted-foreground uppercase tracking-widest"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {course.code}
                </span>
                <div className="md:col-span-4">
                  <p
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-sm font-light text-foreground"
                  >
                    {course.title}
                  </p>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5 md:hidden"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {course.level} · {course.price}
                  </p>
                </div>
                <span
                  className="md:col-span-2 text-xs text-muted-foreground hidden md:block"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {course.level}
                </span>
                <span
                  className="md:col-span-1 text-xs text-foreground hidden md:block"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {course.price}
                </span>
                <div className="md:col-span-2">
                  <button
                    onClick={() => togglePublished(course.slug)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 transition-all ${
                      course.published
                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </button>
                </div>
                <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                  <Link
                    to={`/cursos/${course.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground px-3 py-2 transition-all"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Eye size={11} />
                    <span className="hidden sm:inline">Ver</span>
                  </Link>
                  <Link
                    to={`/admin/cursos/${course.slug}/editar`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-accent text-muted-foreground hover:text-accent px-3 py-2 transition-all"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Pencil size={11} />
                    <span className="hidden sm:inline">Editar</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
