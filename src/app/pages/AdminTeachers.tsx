import { useState, useEffect } from "react";
import { Pencil, ToggleLeft, ToggleRight, Plus, X } from "lucide-react";
import { AdminNav } from "./AdminDashboard";
import { supabase } from "../../lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import Nav from "../components/figma/Nav";

interface ProfesorDB {
  id: string;
  name: string;
  email: string;
  role: string;
  profesor_slug: string | null;
  avatar_url: string | null;
  specialty: string | null;
  bio: string | null;
}

interface EditForm {
  name: string;
  email: string;
  specialty: string;
  bio: string;
}

export default function AdminTeachers() {
  const [profesores, setProfesores] = useState<ProfesorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<ProfesorDB | null>(null);
  const [form, setForm] = useState<EditForm>({ name: "", email: "", specialty: "", bio: "" });
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function fetchProfesores() {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, email, role, profesor_slug, avatar_url, specialty, bio")
      .in("role", ["profesor", "alumno"])
      .not("profesor_slug", "is", null)
      .order("name");
    setProfesores(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchProfesores(); }, []);

  function openEdit(p: ProfesorDB) {
    setEditTarget(p);
    setForm({ name: p.name, email: p.email, specialty: p.specialty ?? "", bio: p.bio ?? "" });
    setAvatarPreview(p.avatar_url);
    setError(null);
    setSuccess(null);
  }

  function closeEdit() {
    setEditTarget(null);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editTarget) return;
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${editTarget.profesor_slug ?? editTarget.id}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", editTarget.id);
    setAvatarPreview(publicUrl);
    setUploading(false);
    fetchProfesores();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .update({
        name: form.name.trim(),
        email: form.email.trim(),
        specialty: form.specialty.trim() || null,
        bio: form.bio.trim() || null,
      })
      .eq("id", editTarget.id);
    if (err) {
      setError(err.message);
    } else {
      setSuccess("Guardado correctamente");
      fetchProfesores();
    }
    setSaving(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    const { data: profile, error: findErr } = await supabase
      .from("profiles")
      .select("id, name, profesor_slug")
      .eq("email", inviteEmail.trim())
      .single();

    if (findErr || !profile) {
      setInviteError("No se encontró ningún usuario con ese email. Debe registrarse primero.");
      setInviting(false);
      return;
    }

    const slug = profile.profesor_slug ?? profile.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-");

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ role: "profesor", profesor_slug: slug })
      .eq("id", profile.id);

    if (updateErr) {
      setInviteError(updateErr.message);
    } else {
      setInviteSuccess(`${profile.name} ahora tiene acceso como profesor.`);
      setInviteEmail("");
      fetchProfesores();
    }
    setInviting(false);
  }

  async function toggleAcceso(p: ProfesorDB) {
    const newRole = p.role === "profesor" ? "alumno" : "profesor";
    await supabase.from("profiles").update({ role: newRole }).eq("id", p.id);
    fetchProfesores();
  }

  const labelStyle = { fontFamily: "'DM Mono', monospace" };
  const titleStyle = { fontFamily: "'Krona One', sans-serif" };
  const bodyStyle = { fontFamily: "'Outfit', sans-serif" };

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden" style={bodyStyle}>
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>
      <Nav />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8 mb-12">
            <div>
              <span className="text-xs text-accent tracking-widest uppercase block mb-3" style={labelStyle}>
                Administración
              </span>
              <h1 style={{ ...titleStyle, fontSize: "clamp(24px, 3vw, 44px)" }} className="font-light text-foreground">
                Profesores
              </h1>
            </div>
            <button
              onClick={() => { setShowInvite((v) => !v); setInviteResult(null); setInviteError(null); }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 transition-colors flex-shrink-0"
              style={labelStyle}
            >
              {showInvite ? <X size={14} /> : <Plus size={14} />}
              {showInvite ? "Cancelar" : "Nuevo profesor"}
            </button>
          </div>

          {showInvite && (
            <div className="border border-border p-6 mb-8">
              <p className="text-xs text-muted-foreground mb-4" style={labelStyle}>
                El usuario debe haberse registrado previamente con su email.
              </p>
              <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground" style={labelStyle}>Email del usuario</label>
                  <input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => { setInviteEmail(e.target.value); setInviteError(null); setInviteSuccess(null); }}
                    placeholder="email@dominio.com"
                    className="px-4 py-3 bg-input-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors text-sm"
                    style={bodyStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-6 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors flex-shrink-0 disabled:opacity-50"
                  style={labelStyle}
                >
                  {inviting ? "Buscando..." : "Dar acceso"}
                </button>
              </form>
              {inviteError && <p className="text-sm text-destructive mt-3" style={bodyStyle}>{inviteError}</p>}
              {inviteSuccess && <p className="text-sm mt-3" style={{ color: "var(--accent)", ...bodyStyle }}>{inviteSuccess}</p>}
            </div>
          )}

          <AdminNav active="/admin/profesores" />

          {loading ? (
            <p className="text-sm text-muted-foreground mt-8" style={labelStyle}>Cargando...</p>
          ) : profesores.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-8" style={labelStyle}>No hay profesores registrados.</p>
          ) : (
            <div className="border border-border mt-8">
              <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-widest" style={labelStyle}>
                <span className="col-span-4">Profesor</span>
                <span className="col-span-3">Email</span>
                <span className="col-span-2">Especialidad</span>
                <span className="col-span-2">Acceso</span>
                <span className="col-span-1 text-right"></span>
              </div>

              {profesores.map((p, i) => (
                <div
                  key={p.id}
                  className={`grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-0 px-6 py-4 hover:bg-secondary/30 transition-colors ${
                    i < profesores.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 overflow-hidden border border-border bg-secondary">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground" style={labelStyle}>
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-foreground truncate" style={titleStyle}>{p.name}</span>
                  </div>
                  <span className="md:col-span-3 text-xs text-muted-foreground truncate" style={bodyStyle}>{p.email}</span>
                  <span className="md:col-span-2 text-xs text-muted-foreground hidden md:block truncate" style={labelStyle}>
                    {p.specialty ?? "—"}
                  </span>
                  <div className="md:col-span-2">
                    <button
                      onClick={() => toggleAcceso(p)}
                      className={`flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors ${
                        p.role === "profesor" ? "text-accent" : "text-muted-foreground"
                      }`}
                      style={labelStyle}
                    >
                      {p.role === "profesor" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {p.role === "profesor" ? "Activo" : "Sin acceso"}
                    </button>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                      title="Editar perfil"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!editTarget} onOpenChange={(v) => !v && closeEdit()}>
        <DialogContent className="rounded-none border border-border bg-background p-0 max-w-lg w-full" style={bodyStyle}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-muted-foreground" style={labelStyle}>
              Editar profesor
            </p>
            <DialogTitle className="text-xl text-foreground" style={titleStyle}>
              {editTarget?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground" style={labelStyle}>
                Imagen
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 border border-border bg-secondary overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs" style={labelStyle}>
                      —
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center px-3 py-2 text-[10px] uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer w-fit"
                    style={labelStyle}
                  >
                    {uploading ? "Subiendo..." : "Seleccionar archivo"}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  <p className="text-[10px] text-muted-foreground" style={labelStyle}>
                    JPG, PNG o WebP · máx 5 MB
                  </p>
                </div>
              </div>
            </div>

            {[
              { label: "Nombre", key: "name" as const, type: "text", required: true },
              { label: "Email", key: "email" as const, type: "email", required: true },
              { label: "Especialidad", key: "specialty" as const, type: "text", required: false },
            ].map(({ label, key, type, required }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground" style={labelStyle}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={required}
                  className="w-full px-3 py-2.5 text-sm bg-input-background border border-border text-foreground focus:border-accent focus:outline-none transition-colors"
                  style={bodyStyle}
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground" style={labelStyle}>
                Descripción (aparece en Claustro)
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-input-background border border-border text-foreground focus:border-accent focus:outline-none transition-colors resize-none"
                style={bodyStyle}
              />
            </div>

            {error && <p className="text-sm text-destructive" style={bodyStyle}>{error}</p>}
            {success && <p className="text-sm" style={{ color: "var(--accent)", ...bodyStyle }}>{success}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeEdit}
                className="flex-1 px-4 py-2.5 text-xs uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                style={labelStyle}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-50 transition-colors"
                style={{ ...labelStyle, backgroundColor: "var(--accent)" }}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
