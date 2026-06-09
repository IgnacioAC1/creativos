import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { events } from "../data";
import Nav from "../components/figma/Nav";

export default function AdminEventEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = id ? events.find((e) => String(e.id) === id) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [type, setType] = useState<"online" | "presencial">(
    (existing?.type as "online" | "presencial") ?? "online"
  );
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "");
  const [instructor, setInstructor] = useState(existing?.instructor ?? "");
  const [seats, setSeats] = useState(existing?.seats ?? "");
  const [price, setPrice] = useState(existing?.price ?? "Gratuito");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => navigate("/admin/eventos"), 1500);
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
              {existing ? "Editar evento" : "Nuevo evento"}
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
              <p className="text-muted-foreground">Volviendo a la gestión de eventos…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 flex flex-col gap-5">

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Título del evento
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre del evento"
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
                    placeholder="Descripción del evento"
                    className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm resize-none"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Tipo
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as "online" | "presencial")}
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground outline-none focus:border-accent transition-colors text-sm appearance-none"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <option value="online">Online</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Precio
                    </label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Gratuito / €89"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Fecha
                    </label>
                    <input
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="22 Jun 2025"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Hora
                    </label>
                    <input
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="18:00 — 20:00 CET"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Instructor/a
                    </label>
                    <input
                      type="text"
                      required
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      placeholder="Marta Solís"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Plazas
                    </label>
                    <input
                      type="text"
                      required
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      placeholder="200 plazas"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    />
                  </div>
                </div>

                {type === "presencial" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Espacio Matadero, Madrid"
                      className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                    URL de imagen
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://…"
                    className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="border border-border p-6 sticky top-28 flex flex-col gap-6">
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Previsualización
                    </p>
                    {image && (
                      <div className="aspect-[16/9] overflow-hidden mb-4">
                        <img src={image} alt="" className="w-full h-full object-cover opacity-60 grayscale" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs tracking-widest uppercase px-3 py-1 ${
                          type === "online" ? "bg-secondary text-accent" : "bg-accent text-accent-foreground"
                        }`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        ● {type === "online" ? "Online" : "Presencial"}
                      </span>
                      <span
                        className="text-xs tracking-widest uppercase px-3 py-1 bg-secondary text-foreground"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {price || "—"}
                      </span>
                    </div>
                    {title && (
                      <h3
                        style={{ fontFamily: "'Krona One', sans-serif" }}
                        className="text-lg font-light text-foreground mt-3"
                      >
                        {title}
                      </h3>
                    )}
                    {date && (
                      <p
                        className="text-xs text-muted-foreground mt-2 uppercase tracking-widest"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {date} · {time}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {existing ? "Guardar cambios" : "Crear evento"}
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
