import { faculty } from "../../data";

export default function Faculty() {
  return (
    <section id="claustro" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="mb-14 border-b border-border pb-8">
          <span
            className="text-xs text-accent tracking-widest uppercase block mb-3"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            05 / Claustro
          </span>
          <h2
            style={{ fontFamily: "'Krona One', sans-serif" }}
            className="text-4xl md:text-5xl font-light text-foreground"
          >
            Quienes te enseñan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <div key={f.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-5">
                <img
                  src={f.image}
                  alt={f.alt}
                  className="w-full h-full object-cover grayscale opacity-75 transition-all duration-700 group-hover:opacity-90 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="text-xs text-foreground/60 tracking-widest uppercase bg-background/50 backdrop-blur-sm px-2 py-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {f.courses} {f.courses === 1 ? "curso" : "cursos"}
                  </span>
                </div>
              </div>
              <h3
                style={{ fontFamily: "'Krona One', sans-serif" }}
                className="text-2xl font-light text-foreground"
              >
                {f.name}
              </h3>
              <p
                className="text-xs text-accent tracking-widest uppercase mt-1 mb-3"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {f.role}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
