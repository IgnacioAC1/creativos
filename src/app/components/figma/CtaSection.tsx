import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section
      className="py-28 md:py-44 border-t border-border"
      style={{ backgroundColor: "#EAE6DE", color: "#0A0A0A" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 text-center">
        <span
          className="text-xs tracking-widest uppercase block mb-8"
          style={{ fontFamily: "'DM Mono', monospace", color: "rgba(10,10,10,0.4)" }}
        >
          07 / Empieza hoy
        </span>
        <h2
          style={{
            fontFamily: "'Krona One', sans-serif",
            fontSize: "clamp(48px, 7vw, 112px)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#0A0A0A",
          }}
        >
          Tu primer curso,
          <br />
          <span>ahora mismo.</span>
        </h2>
        <p
          className="mt-7 max-w-md mx-auto text-sm leading-relaxed"
          style={{ color: "rgba(10,10,10,0.55)" }}
        >
          Acceso inmediato tras la compra. Sin suscripciones, sin horarios. Aprende a tu ritmo con
          vídeos de calidad profesional.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/cursos"
            className="inline-flex items-center gap-3 text-xs tracking-widest uppercase px-8 py-4 transition-all duration-200"
            style={{
              fontFamily: "'DM Mono', monospace",
              backgroundColor: "#0A0A0A",
              color: "#EAE6DE",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C8420D";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0A0A0A";
            }}
          >
            Ver todos los cursos
            <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/eventos"
            className="inline-flex items-center gap-3 text-xs tracking-widest uppercase px-8 py-4 border transition-all duration-200"
            style={{
              fontFamily: "'DM Mono', monospace",
              borderColor: "rgba(10,10,10,0.3)",
              color: "#0A0A0A",
            }}
          >
            Próximos eventos
          </Link>
        </div>
      </div>
    </section>
  );
}
