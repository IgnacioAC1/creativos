import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { faculty } from "../data";
import Nav from "../components/figma/Nav";
import { AdminNav } from "./AdminDashboard";

interface TeacherEntry {
  slug: string;
  name: string;
  email: string;
  role: string;
  courses: number;
  active: boolean;
  image: string;
}

const INITIAL_TEACHERS: TeacherEntry[] = faculty.map((f) => ({
  slug: f.slug,
  name: f.name,
  email: `${f.slug.replace("-", ".")}@academiacreativa.com`,
  role: f.role,
  courses: f.courses,
  active: true,
  image: f.image,
}));

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherEntry[]>(INITIAL_TEACHERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  function toggleActive(slug: string) {
    setTeachers((prev) =>
      prev.map((t) => (t.slug === slug ? { ...t, active: !t.active } : t))
    );
  }

  function removeTeacher(slug: string) {
    setTeachers((prev) => prev.filter((t) => t.slug !== slug));
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const newSlug = inviteName.toLowerCase().replace(/\s+/g, "-");
    setTeachers((prev) => [
      ...prev,
      {
        slug: newSlug,
        name: inviteName,
        email: inviteEmail,
        role: "Profesor",
        courses: 0,
        active: true,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format",
      },
    ]);
    setInviteEmail("");
    setInviteName("");
    setShowInvite(false);
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
                Profesores
              </h1>
            </div>
            <button
              onClick={() => setShowInvite((v) => !v)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 transition-colors flex-shrink-0"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Plus size={14} />
              Invitar profesor
            </button>
          </div>

          <AdminNav active="/admin/profesores" />

          {showInvite && (
            <form
              onSubmit={handleInvite}
              className="border border-accent/30 bg-accent/5 p-6 mb-8 flex flex-col sm:flex-row gap-4 items-end"
            >
              <div className="flex flex-col gap-2 flex-1">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Nombre
                </label>
                <input
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Nombre del profesor"
                  className="px-4 py-3 bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@dominio.com"
                  className="px-4 py-3 bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors flex-shrink-0"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Añadir
              </button>
            </form>
          )}

          <div className="border border-border">
            <div
              className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="col-span-4">Profesor</span>
              <span className="col-span-3">Email</span>
              <span className="col-span-2">Especialidad</span>
              <span className="col-span-1">Cursos</span>
              <span className="col-span-1">Acceso</span>
              <span className="col-span-1 text-right"></span>
            </div>

            {teachers.map((teacher, i) => (
              <div
                key={teacher.slug}
                className={`grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-0 px-6 py-4 ${
                  i < teachers.length - 1 ? "border-b border-border" : ""
                } hover:bg-secondary/30 transition-colors`}
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-9 h-9 object-cover grayscale flex-shrink-0"
                  />
                  <p
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-sm font-light text-foreground"
                  >
                    {teacher.name}
                  </p>
                </div>
                <span
                  className="md:col-span-3 text-xs text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {teacher.email}
                </span>
                <span
                  className="md:col-span-2 text-xs text-muted-foreground hidden md:block"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {teacher.role}
                </span>
                <span
                  className="md:col-span-1 text-xs text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {teacher.courses}
                </span>
                <div className="md:col-span-1">
                  <button
                    onClick={() => toggleActive(teacher.slug)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 transition-all ${
                      teacher.active
                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {teacher.active ? "Activo" : "Inactivo"}
                  </button>
                </div>
                <div className="md:col-span-1 flex items-center justify-end">
                  <button
                    onClick={() => removeTeacher(teacher.slug)}
                    className="text-muted-foreground/40 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
