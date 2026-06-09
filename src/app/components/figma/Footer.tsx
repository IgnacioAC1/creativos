const SOCIAL_LINKS = ["Instagram", "Behance", "LinkedIn", "YouTube"];

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          style={{ fontFamily: "'Krona One', sans-serif" }}
          className="text-lg font-semibold text-foreground"
        >
          AcademiaCreativa
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {s}
            </a>
          ))}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Volver arriba ↑
        </button>
      </div>
    </footer>
  );
}
