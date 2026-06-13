import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: Props) {
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) setName(user?.name ?? "");
  }, [open, user?.name]);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setPassword("");
      setConfirm("");
      setError(null);
      setSuccess(null);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (name.trim() !== user!.name) {
      const err = await updateName(name.trim());
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
    }

    if (password) {
      if (password !== confirm) {
        setError("Las contraseñas no coinciden");
        setSaving(false);
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setSaving(false);
        return;
      }
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) {
        setError(authError.message);
        setSaving(false);
        return;
      }
    }

    setSuccess("Cambios guardados correctamente");
    setSaving(false);
    setPassword("");
    setConfirm("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="rounded-none border border-border bg-background p-0 max-w-md w-full"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <p
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}
          >
            Tu perfil
          </p>
          <DialogTitle
            className="text-xl text-foreground"
            style={{ fontFamily: "'Krona One', sans-serif" }}
          >
            Editar perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-[10px] uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-input-background border border-border text-foreground focus:border-accent focus:outline-none transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col gap-2">
            <p
              className="text-[10px] uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Cambiar contraseña
            </p>
            <p className="text-xs text-muted-foreground -mt-1">
              Deja en blanco para no modificarla.
            </p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-input-background border border-border text-foreground focus:border-accent focus:outline-none transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-input-background border border-border text-foreground focus:border-accent focus:outline-none transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm" style={{ color: "var(--accent)", fontFamily: "'Outfit', sans-serif" }}>
              {success}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-xs uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-50 transition-colors"
              style={{
                fontFamily: "'DM Mono', monospace",
                backgroundColor: "var(--accent)",
              }}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
