import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Props {
  eventTitle: string;
  open: boolean;
  onClose: () => void;
}

export default function EventSignupModal({ eventTitle, open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setName("");
      setEmail("");
      setSent(false);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-background border border-border p-8 max-w-md rounded-none"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {sent ? (
          <div className="text-center py-4">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              ¡Confirmado!
            </span>
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-2xl font-light text-foreground mb-3"
            >
              Plaza reservada
            </h2>
            <p className="text-sm text-muted-foreground">
              Te enviaremos todos los detalles a tu correo.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 px-8 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span
                className="text-xs text-accent tracking-widest uppercase mb-2 block"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Inscripción
              </span>
              <DialogTitle
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-xl font-light text-foreground leading-snug"
              >
                {eventTitle}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Evento
                </label>
                <input
                  type="text"
                  readOnly
                  value={eventTitle}
                  className="w-full px-4 py-3 bg-input-background border border-border text-muted-foreground text-sm cursor-default"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Tu nombre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors mt-1"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Reservar plaza
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
