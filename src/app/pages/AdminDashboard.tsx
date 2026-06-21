import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, TrendingUp, Send, RefreshCw } from "lucide-react";
import { mockMetrics, courses } from "../data";
import Nav from "../components/figma/Nav";
import { supabase } from "../../lib/supabase";

const NAV_LINKS = [
  { label: "Métricas", to: "/admin" },
  { label: "Cursos", to: "/admin/cursos" },
  { label: "Eventos", to: "/admin/eventos" },
  { label: "Profesores", to: "/admin/profesores" },
];

export function AdminNav({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-1 border border-border p-1 mb-12 w-fit">
      {NAV_LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200 ${
            active === l.to
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
}) {
  return (
    <div className="border border-border p-6 flex flex-col gap-3">
      <span
        className="text-xs text-muted-foreground uppercase tracking-widest"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </span>
      <p
        style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(28px, 3vw, 44px)" }}
        className="font-light text-foreground leading-none"
      >
        {value}
      </p>
      {(sub || trend !== undefined) && (
        <div className="flex items-center gap-2">
          {sub && (
            <span className="text-xs text-muted-foreground">{sub}</span>
          )}
          {trend !== undefined && (
            <span
              className={`flex items-center gap-1 text-xs ${trend >= 0 ? "text-accent" : "text-muted-foreground"}`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <TrendingUp size={11} />
              {trend >= 0 ? "+" : ""}{trend} este mes
            </span>
          )}
        </div>
      )}
    </div>
  );
}

type InactiveStudent = {
  user_id: string;
  user_name: string;
  user_email: string;
  course_slug: string;
  enrolled_at: string;
  last_activity: string | null;
};

function InactiveStudentsSection() {
  const [students, setStudents] = useState<InactiveStudent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const courseTitle = (slug: string) =>
    courses.find((c) => c.slug === slug)?.title ?? slug;

  async function load() {
    setLoading(true);
    setError("");
    setSentCount(null);
    const { data, error: fnError } = await supabase.functions.invoke("inactive-students", {
      body: { days: 14 },
    });
    setLoading(false);
    if (fnError) { setError(fnError.message); return; }
    setStudents(data.students ?? []);
  }

  async function sendReminders() {
    if (!students?.length) return;
    setSending(true);
    setError("");
    const { data, error: fnError } = await supabase.functions.invoke("inactive-students", {
      body: { days: 14, send: true },
    });
    setSending(false);
    if (fnError) { setError(fnError.message); return; }
    setSentCount(data.sent ?? 0);
  }

  return (
    <section className="mb-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2
          style={{ fontFamily: "'Krona One', sans-serif" }}
          className="text-lg font-light text-foreground"
        >
          Alumnos inactivos (+14 días)
        </h2>
        <div className="flex items-center gap-3">
          {students !== null && students.length > 0 && (
            <button
              onClick={sendReminders}
              disabled={sending}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-accent text-accent px-4 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Send size={11} />
              {sending ? "Enviando…" : `Enviar recordatorios (${students.length})`}
            </button>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-border text-muted-foreground px-4 py-2.5 hover:border-foreground hover:text-foreground transition-all disabled:opacity-50"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            {loading ? "Cargando…" : students === null ? "Comprobar" : "Actualizar"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-accent mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
          Error: {error}
        </p>
      )}

      {sentCount !== null && (
        <p className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
          {sentCount} recordatorio{sentCount !== 1 ? "s" : ""} enviado{sentCount !== 1 ? "s" : ""} correctamente.
        </p>
      )}

      {students === null && !loading && (
        <div className="border border-border border-dashed px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Pulsa "Comprobar" para detectar alumnos sin actividad en los últimos 14 días.
          </p>
        </div>
      )}

      {students !== null && students.length === 0 && (
        <div className="border border-border border-dashed px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">No hay alumnos inactivos en este momento.</p>
        </div>
      )}

      {students !== null && students.length > 0 && (
        <div className="border border-border">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border">
            {["Alumno", "Curso", "Última actividad", "Inscrito"].map((h) => (
              <span
                key={h}
                className="text-xs uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {h}
              </span>
            ))}
          </div>
          {students.map((s, i) => (
            <div
              key={`${s.user_id}-${s.course_slug}`}
              className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-black/5 dark:hover:bg-secondary/50 transition-colors ${
                i < students.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="text-sm text-foreground">{s.user_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.user_email}</p>
              </div>
              <p className="text-sm text-foreground self-center">{courseTitle(s.course_slug)}</p>
              <p
                className="text-sm self-center"
                style={{ fontFamily: "'DM Mono', monospace", color: "#9E9B96" }}
              >
                {s.last_activity
                  ? new Date(s.last_activity).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                  : "Sin actividad"}
              </p>
              <p
                className="text-xs self-center"
                style={{ fontFamily: "'DM Mono', monospace", color: "#9E9B96" }}
              >
                {new Date(s.enrolled_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminDashboard() {
  const totalEnrolled = mockMetrics.enrollmentsByCourse.reduce((s, c) => s + c.enrolled, 0);
  const totalSignups = mockMetrics.eventSignups.reduce((s, e) => s + e.signups, 0);

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }`}</style>

      <Nav />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16">
          <div className="border-b border-border pb-8 mb-12">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Administración
            </span>
            <h1
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(28px, 4vw, 52px)" }}
              className="font-light text-foreground"
            >
              Dashboard
            </h1>
          </div>

          <AdminNav active="/admin" />

          {/* Métricas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            <MetricCard
              label="Alumnos totales"
              value={totalEnrolled}
              sub="en todos los cursos"
            />
            <MetricCard
              label="Inscripciones eventos"
              value={totalSignups}
              sub="acumulado"
            />
            <MetricCard
              label="Ingresos totales"
              value={`€${mockMetrics.revenue.total.toLocaleString()}`}
              sub="acumulado"
            />
            <MetricCard
              label="Nuevos registros"
              value={mockMetrics.newRegistrations.last30Days}
              sub="últimos 30 días"
              trend={mockMetrics.newRegistrations.trend}
            />
          </div>

          {/* Estado de alumnos por curso */}
          <section className="mb-14">
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-lg font-light text-foreground mb-6"
            >
              Estado de alumnos por curso
            </h2>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-6 mb-4">
              {([
                { label: "Completado",    bg: "#C8420D" },
                { label: "En proceso",    bg: "#9E9B96" },
                { label: "Sin actividad", bg: "#3A3935" },
              ] as const).map(({ label, bg }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-xs"
                  style={{ fontFamily: "'DM Mono', monospace", color: "#9E9B96" }}
                >
                  <span style={{ width: 8, height: 8, flexShrink: 0, backgroundColor: bg, display: "inline-block" }} />
                  {label}
                </span>
              ))}
            </div>

            <div className="border border-border">
              {mockMetrics.studentStatus.map((item, i) => {
                const total = item.completado + item.enProceso + item.sinActividad;
                const pctCompletado   = (item.completado   / total) * 100;
                const pctEnProceso    = (item.enProceso    / total) * 100;
                const pctSinActividad = (item.sinActividad / total) * 100;

                return (
                  <div
                    key={item.courseCode}
                    className={`px-5 py-5 ${i < mockMetrics.studentStatus.length - 1 ? "border-b border-border" : ""}`}
                  >
                    {/* Fila de datos */}
                    <div className="flex flex-wrap items-center gap-y-2 mb-3">
                      <div className="flex-1 min-w-0 mr-4">
                        <span
                          className="text-xs block mb-0.5"
                          style={{ fontFamily: "'DM Mono', monospace", color: "#9E9B96" }}
                        >
                          {item.courseCode}
                        </span>
                        <p className="text-sm text-foreground">{item.title}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs mr-1" style={{ color: "#9E9B96", fontFamily: "'DM Mono', monospace" }}>Comp.</span>
                          <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#C8420D" }}>{item.completado}</span>
                        </div>
                        <div>
                          <span className="text-xs mr-1" style={{ color: "#9E9B96", fontFamily: "'DM Mono', monospace" }}>Proc.</span>
                          <span className="text-sm text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{item.enProceso}</span>
                        </div>
                        <div>
                          <span className="text-xs mr-1" style={{ color: "#9E9B96", fontFamily: "'DM Mono', monospace" }}>S/act.</span>
                          <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#9E9B96" }}>{item.sinActividad}</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra proporcional */}
                    <div className="w-full flex" style={{ height: 3 }}>
                      <div style={{ width: `${pctCompletado}%`,   height: 3, backgroundColor: "#C8420D" }} />
                      <div style={{ width: `${pctEnProceso}%`,    height: 3, backgroundColor: "#9E9B96" }} />
                      <div style={{ width: `${pctSinActividad}%`, height: 3, backgroundColor: "#3A3935" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Alumnos inactivos */}
          <InactiveStudentsSection />

          {/* Detalle por curso */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <h2
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-lg font-light text-foreground mb-6"
              >
                Alumnos por curso
              </h2>
              <div className="flex flex-col border border-border">
                {mockMetrics.enrollmentsByCourse.map((item, i) => {
                  const maxEnrolled = Math.max(...mockMetrics.enrollmentsByCourse.map((c) => c.enrolled));
                  return (
                    <div
                      key={item.courseCode}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        i < mockMetrics.enrollmentsByCourse.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span
                        className="text-xs text-muted-foreground w-12 flex-shrink-0"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {item.courseCode}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.title}</p>
                        <div className="w-full h-0.5 bg-border mt-2">
                          <div
                            className="h-0.5 bg-accent transition-all"
                            style={{ width: `${(item.enrolled / maxEnrolled) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-sm text-foreground flex-shrink-0"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {item.enrolled}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-lg font-light text-foreground mb-6"
              >
                Ingresos por curso
              </h2>
              <div className="flex flex-col border border-border">
                {mockMetrics.revenue.byCourse.map((item, i) => {
                  const maxRevenue = Math.max(...mockMetrics.revenue.byCourse.map((c) => c.revenue));
                  return (
                    <div
                      key={item.courseCode}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        i < mockMetrics.revenue.byCourse.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span
                        className="text-xs text-muted-foreground w-12 flex-shrink-0"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {item.courseCode}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="w-full h-0.5 bg-border">
                          <div
                            className="h-0.5 bg-accent transition-all"
                            style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-sm text-foreground flex-shrink-0"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        €{item.revenue.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border border-border p-5 flex items-center justify-between">
                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Total acumulado
                  </p>
                  <p
                    style={{ fontFamily: "'Krona One', sans-serif" }}
                    className="text-2xl font-light text-foreground"
                  >
                    €{mockMetrics.revenue.total.toLocaleString()}
                  </p>
                </div>
                <Link
                  to="/admin/cursos"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border hover:border-accent text-muted-foreground hover:text-accent px-4 py-2.5 transition-all"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Gestionar cursos
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
