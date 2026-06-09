import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { courses } from "../data";
import Nav from "../components/figma/Nav";

interface LessonDraft {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
}

interface ModuleDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

function blankLesson(idx: number): LessonDraft {
  return { id: `new-l-${Date.now()}-${idx}`, title: "", duration: "", description: "", videoUrl: "" };
}

function blankModule(): ModuleDraft {
  return { id: `new-m-${Date.now()}`, title: "", lessons: [blankLesson(0)] };
}

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = id ? courses.find((c) => c.slug === id) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [level, setLevel] = useState(existing?.level ?? "Fundamentos");
  const [price, setPrice] = useState(existing?.price ?? "");
  const [modules, setModules] = useState<ModuleDraft[]>(
    existing?.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, duration: l.duration, description: l.description, videoUrl: l.videoUrl })),
    })) ?? [blankModule()]
  );
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => navigate("/profesor"), 1500);
  }

  function addModule() {
    setModules((prev) => [...prev, blankModule()]);
  }

  function removeModule(mId: string) {
    setModules((prev) => prev.filter((m) => m.id !== mId));
  }

  function updateModule(mId: string, title: string) {
    setModules((prev) => prev.map((m) => (m.id === mId ? { ...m, title } : m)));
  }

  function addLesson(mId: string) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, lessons: [...m.lessons, blankLesson(m.lessons.length)] } : m
      )
    );
  }

  function removeLesson(mId: string, lId: string) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lId) } : m
      )
    );
  }

  function updateLesson(mId: string, lId: string, field: keyof LessonDraft, value: string) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, [field]: value } : l)) }
          : m
      )
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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 uppercase tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <ArrowLeft size={12} />
            Volver
          </button>

          <div className="border-b border-border pb-8 mb-12">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {existing ? "Editar curso" : "Nuevo curso"}
            </span>
            <h1
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(24px, 3vw, 44px)" }}
              className="font-light text-foreground"
            >
              {title || "Sin título"}
            </h1>
          </div>

          {saved ? (
            <div className="text-center py-16">
              <p
                className="text-xs text-accent uppercase tracking-widest mb-3"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Guardado
              </p>
              <p className="text-muted-foreground">El curso se ha guardado como borrador.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 flex flex-col gap-8">
                <section>
                  <h2
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-base font-light text-foreground mb-5"
                  >
                    Información general
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                        Título del curso
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nombre del curso"
                        className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                        Descripción
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del curso"
                        className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm resize-none"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                          Nivel
                        </label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="w-full px-4 py-3 bg-input-background border border-border text-foreground outline-none focus:border-accent transition-colors text-sm appearance-none"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {["Fundamentos", "Intermedio", "Avanzado", "Máster"].map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                          Precio
                        </label>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="€249"
                          className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      style={{ fontFamily: "'Krona One', sans-serif" }}
                      className="text-base font-light text-foreground"
                    >
                      Módulos y lecciones
                    </h2>
                    <button
                      type="button"
                      onClick={addModule}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-accent text-muted-foreground hover:text-accent px-4 py-2 transition-all"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <Plus size={12} />
                      Módulo
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {modules.map((mod, mIdx) => (
                      <div key={mod.id} className="border border-border">
                        <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 border-b border-border">
                          <GripVertical size={14} className="text-muted-foreground/40 flex-shrink-0" />
                          <span
                            className="text-xs text-muted-foreground uppercase tracking-widest w-6 flex-shrink-0"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {String(mIdx + 1).padStart(2, "0")}
                          </span>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => updateModule(mod.id, e.target.value)}
                            placeholder="Título del módulo"
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                            style={{ fontFamily: "'Krona One', sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeModule(mod.id)}
                            className="text-muted-foreground/40 hover:text-accent transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="flex flex-col divide-y divide-border/50">
                          {mod.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="p-4 flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className="text-xs text-muted-foreground/60 w-5 flex-shrink-0"
                                  style={{ fontFamily: "'DM Mono', monospace" }}
                                >
                                  {String(lIdx + 1).padStart(2, "0")}
                                </span>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                                  placeholder="Título de la lección"
                                  className="flex-1 bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-accent transition-colors"
                                  style={{ fontFamily: "'Outfit', sans-serif" }}
                                />
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(mod.id, lesson.id, "duration", e.target.value)}
                                  placeholder="15 min"
                                  className="w-20 bg-input-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-accent transition-colors"
                                  style={{ fontFamily: "'DM Mono', monospace" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeLesson(mod.id, lesson.id)}
                                  className="text-muted-foreground/40 hover:text-accent transition-colors flex-shrink-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={lesson.description}
                                onChange={(e) => updateLesson(mod.id, lesson.id, "description", e.target.value)}
                                placeholder="Descripción breve de la lección"
                                className="w-full bg-input-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-accent transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                              />
                              <input
                                type="url"
                                value={lesson.videoUrl}
                                onChange={(e) => updateLesson(mod.id, lesson.id, "videoUrl", e.target.value)}
                                placeholder="URL del vídeo (YouTube embed, Vimeo…)"
                                className="w-full bg-input-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-accent transition-colors"
                                style={{ fontFamily: "'DM Mono', monospace" }}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addLesson(mod.id)}
                            className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            <Plus size={11} />
                            Añadir lección
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-5">
                <div className="border border-border p-6 sticky top-28">
                  <h2
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-base font-light text-foreground mb-4"
                  >
                    Estado del curso
                  </h2>
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className="text-xs uppercase tracking-widest px-3 py-1.5 bg-secondary text-muted-foreground"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Borrador
                    </span>
                    <p className="text-xs text-muted-foreground">Solo el admin puede publicar.</p>
                  </div>

                  <div
                    className="text-xs text-muted-foreground mb-6 leading-relaxed"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <p>{modules.length} módulos</p>
                    <p>{modules.reduce((s, m) => s + m.lessons.length, 0)} lecciones en total</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Guardar borrador
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
