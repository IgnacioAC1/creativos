import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { Lock, Play, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, X } from "lucide-react";
import type { Lesson } from "../data";
import { faculty } from "../data";
import Nav from "../components/figma/Nav";
import Footer from "../components/figma/Footer";
import { useAuth } from "../context/AuthContext";
import CourseCompletionModal from "../components/CourseCompletionModal";
import { useCourse } from "../../lib/hooks/useCourses";
import { supabase } from "../../lib/supabase";

const PROGRESS_KEY = "ac_progress";

function loadProgress(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, string[]>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isEnrolled, user } = useAuth();
  const navigate = useNavigate();
  const { course, loading } = useCourse(slug);
  const professor = course ? faculty.find((f) => f.slug === course.profesorSlug) : null;
  const enrolled = course ? isEnrolled(course.slug) : false;

  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Record<string, string[]>>(loadProgress);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    if (!user || !course) return;
    setCheckingOut(true);
    try {
      const priceCents = parseInt(course.price.replace(/[€.,\s]/g, "")) * 100;
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          course_slug: course.slug,
          course_title: course.title,
          price_in_cents: priceCents,
          user_name: user.name ?? "",
        },
      });
      if (error || !data?.url) throw new Error(error?.message ?? "Error al crear sesión de pago");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setCheckingOut(false);
    }
  }

  useEffect(() => {
    if (course?.modules[0]?.id) {
      setOpenModules(new Set([course.modules[0].id]));
    }
  }, [course?.modules[0]?.id]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>Cargando curso…</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Curso no encontrado.</p>
      </div>
    );
  }

  const completedIds = progress[course.slug] ?? [];
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0;

  function toggleModule(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleComplete(lessonId: string) {
    setProgress((prev) => {
      const current = prev[course!.slug] ?? [];
      const isMarking = !current.includes(lessonId);
      const updated = isMarking
        ? [...current, lessonId]
        : current.filter((id) => id !== lessonId);
      if (isMarking && updated.length === totalLessons) {
        setShowCompletionModal(true);
      }
      return { ...prev, [course!.slug]: updated };
    });
  }

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <Nav />

      <main className="pt-24">
        {/* Hero del curso */}
        <div className="relative border-b border-border">
          <div className="absolute inset-0">
            <img
              src={course.image}
              alt={course.alt}
              className="w-full h-full object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-8 md:px-12 py-20 md:py-28">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <ArrowLeft size={12} />
              Volver
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs tracking-widest uppercase px-3 py-1.5 bg-secondary text-muted-foreground"
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

                <h1
                  style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(32px, 4vw, 60px)" }}
                  className="font-light text-foreground leading-tight mb-5"
                >
                  {course.title}
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  {course.description}
                </p>

                {professor && (
                  <div className="flex items-center gap-3">
                    <img
                      src={professor.image}
                      alt={professor.alt}
                      className="w-10 h-10 object-cover grayscale"
                    />
                    <div>
                      <p className="text-sm text-foreground font-medium">{professor.name}</p>
                      <p
                        className="text-xs text-muted-foreground tracking-widest uppercase"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {professor.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card light:bg-white border border-border p-8 min-w-[260px]">
                {!enrolled && (
                  <p
                    className="text-3xl text-foreground mb-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {course.price}
                  </p>
                )}
                <div
                  className="flex gap-4 text-xs text-muted-foreground tracking-widest uppercase mb-6"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  <span>{course.lessons} lecciones</span>
                  <span>{course.hours}</span>
                </div>

                {enrolled ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="text-xs text-muted-foreground uppercase tracking-widest"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        Progreso
                      </span>
                      <span
                        className="text-xs text-accent"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {progressPct}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-border mb-4">
                      <div
                        className="h-1 bg-accent transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p
                      className="text-xs text-accent uppercase tracking-widest"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Acceso activo
                    </p>
                  </div>
                ) : (
                  {user ? (
                    <button
                      onClick={handleCheckout}
                      disabled={checkingOut}
                      className="block w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors text-center disabled:opacity-60"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {checkingOut ? "Redirigiendo…" : `Acceder · ${course.price}`}
                    </button>
                  ) : (
                    <Link
                      to="/registro"
                      className="block w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors text-center"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Acceder al curso
                    </Link>
                  )}
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16">
          {/* Reproductor de vídeo */}
          {activeLesson && enrolled && (
            <div className="border border-border mb-12">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/40">
                <div>
                  <span
                    className="text-xs text-accent uppercase tracking-widest block mb-0.5"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Reproduciendo
                  </span>
                  <h3
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-base font-light text-foreground"
                  >
                    {activeLesson.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Cerrar vídeo"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-start justify-between gap-4 px-6 py-5 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {activeLesson.description}
                </p>
                <button
                  onClick={() => {
                    toggleComplete(activeLesson.id);
                    if (!completedIds.includes(activeLesson.id)) setActiveLesson(null);
                  }}
                  className={`flex-shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest px-5 py-2.5 transition-all ${
                    completedIds.includes(activeLesson.id)
                      ? "border border-accent/40 text-accent"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  <CheckCircle size={13} />
                  {completedIds.includes(activeLesson.id) ? "Completada" : "Marcar completada"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <h2
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-2xl font-light text-foreground mb-8"
              >
                Contenido del curso
              </h2>

              <div className="flex flex-col gap-2">
                {course.modules.map((mod, modIdx) => {
                  const isOpen = openModules.has(mod.id);
                  const modCompleted = mod.lessons.filter((l) => completedIds.includes(l.id)).length;

                  return (
                    <div key={mod.id} className="border border-border">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <span
                            className="text-xs text-muted-foreground uppercase tracking-widest"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {String(modIdx + 1).padStart(2, "0")}
                          </span>
                          <span
                            style={{ fontFamily: "'Krona One', sans-serif" }}
                            className="text-sm font-light text-foreground"
                          >
                            {mod.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <span
                            className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:block"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {modCompleted}/{mod.lessons.length}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={14} className="text-muted-foreground" />
                          ) : (
                            <ChevronDown size={14} className="text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border">
                          {mod.lessons.map((lesson, idx) => {
                            const done = completedIds.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center gap-4 px-6 py-4 border-b border-border/50 last:border-b-0 ${
                                  enrolled ? "cursor-pointer hover:bg-secondary/30 transition-colors" : ""
                                } ${activeLesson?.id === lesson.id ? "bg-secondary/50" : ""}`}
                                onClick={enrolled ? () => setActiveLesson(lesson) : undefined}
                              >
                                <span
                                  className="text-xs text-muted-foreground w-5 flex-shrink-0"
                                  style={{ fontFamily: "'DM Mono', monospace" }}
                                >
                                  {String(idx + 1).padStart(2, "0")}
                                </span>

                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                    {lesson.title}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <span
                                    className="text-xs text-muted-foreground"
                                    style={{ fontFamily: "'DM Mono', monospace" }}
                                  >
                                    {lesson.duration}
                                  </span>
                                  {!enrolled ? (
                                    <Lock size={13} className="text-muted-foreground/40" />
                                  ) : done ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      title="Quitar completada"
                                    >
                                      <CheckCircle size={15} className="text-accent" />
                                    </button>
                                  ) : (
                                    <Play size={13} className="text-muted-foreground/50 group-hover:text-accent" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h2
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-2xl font-light text-foreground mb-8"
              >
                Lo que aprenderás
              </h2>
              <ul className="flex flex-col gap-3">
                {course.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>

              {!enrolled && (
                <div className="mt-12 p-6 border border-accent/30 bg-accent/5">
                  <p
                    className="text-xs text-accent uppercase tracking-widest mb-3"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Acceso completo
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">
                    Con acceso al curso desbloqueas todas las lecciones, descripciones detalladas,
                    vídeos y el seguimiento de tu progreso.
                  </p>
                  <Link
                    to={user ? "#" : "/registro"}
                    className="block w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors text-center"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {course.price} — Acceder ahora
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CourseCompletionModal
        open={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        studentName={user?.name ?? ""}
        studentEmail={user?.email ?? ""}
        courseName={course.title}
        professorName={professor?.name ?? "Academia Creativa"}
        courseSlug={course.slug}
      />
    </div>
  );
}
