import { Link } from "react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { mockMetrics } from "../data";
import Nav from "../components/figma/Nav";

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
