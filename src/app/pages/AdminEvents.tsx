import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { events as initialEvents } from "../data";
import Nav from "../components/figma/Nav";
import { AdminNav } from "./AdminDashboard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

type EventItem = (typeof initialEvents)[number] & { published?: boolean };

export default function AdminEvents() {
  const [eventList, setEventList] = useState<EventItem[]>(
    initialEvents.map((e) => ({ ...e, published: true }))
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function togglePublished(id: number) {
    setEventList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, published: !e.published } : e))
    );
  }

  function deleteEvent(id: number) {
    setEventList((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
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
                Gestión de eventos
              </h1>
            </div>
            <Link
              to="/admin/eventos/nuevo"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 transition-colors flex-shrink-0"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Plus size={14} />
              Nuevo evento
            </Link>
          </div>

          <AdminNav active="/admin/eventos" />

          <div className="border border-border">
            <div
              className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="col-span-5">Evento</span>
              <span className="col-span-2">Fecha</span>
              <span className="col-span-1">Tipo</span>
              <span className="col-span-1">Precio</span>
              <span className="col-span-1">Estado</span>
              <span className="col-span-2 text-right">Acciones</span>
            </div>

            {eventList.map((ev, i) => (
              <div
                key={ev.id}
                className={`grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-0 px-6 py-4 ${
                  i < eventList.length - 1 ? "border-b border-border" : ""
                } hover:bg-secondary/30 transition-colors`}
              >
                <div className="md:col-span-5">
                  <p
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-sm font-light text-foreground"
                  >
                    {ev.title}
                  </p>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {ev.instructor}
                  </p>
                </div>
                <span
                  className="md:col-span-2 text-xs text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {ev.date}
                </span>
                <span
                  className={`md:col-span-1 text-xs uppercase tracking-widest ${
                    ev.type === "online" ? "text-accent" : "text-foreground"
                  }`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {ev.type}
                </span>
                <span
                  className="md:col-span-1 text-xs text-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {ev.price}
                </span>
                <div className="md:col-span-1">
                  <button
                    onClick={() => togglePublished(ev.id)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 transition-all ${
                      ev.published
                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {ev.published ? "Pub." : "Draft"}
                  </button>
                </div>
                <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                  <Link
                    to={`/admin/eventos/${ev.id}/editar`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-accent text-muted-foreground hover:text-accent px-3 py-2 transition-all"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Pencil size={11} />
                    <span className="hidden sm:inline">Editar</span>
                  </Link>
                  <button
                    onClick={() => setDeleteId(ev.id)}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-red-500/50 text-muted-foreground hover:text-red-400 px-3 py-2 transition-all"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}

            {eventList.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-muted-foreground text-sm">No hay eventos.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El evento será eliminado permanentemente.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteEvent(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
