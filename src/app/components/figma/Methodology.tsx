import { Video, Play, Users, Calendar } from "lucide-react";
import { methodology } from "../../data";

const ICONS = { Video, Play, Users, Calendar } as const;

export default function Methodology() {
  return (
    <section id="metodología" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-6"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              04 / Metodología
            </span>
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-4xl md:text-5xl font-light text-foreground leading-tight"
            >
              Cómo
              <br />
              <span>funciona</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed text-sm max-w-xs">
              Un modelo que combina la flexibilidad del vídeo con la energía del aprendizaje en
              comunidad y los eventos en directo.
            </p>
          </div>

          <div className="lg:col-span-8">
            {methodology.map((m) => {
              const Icon = ICONS[m.iconName];
              return (
                <div
                  key={m.n}
                  className="group border-b border-border py-8 grid grid-cols-12 gap-4 items-start hover:bg-black/5 dark:hover:bg-secondary/50 transition-colors duration-200 -mx-4 px-4"
                >
                  <div className="col-span-2 flex flex-col items-start gap-2">
                    <span
                      className="text-xs text-muted-foreground tracking-widest"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {m.n}
                    </span>
                    <span className="text-accent">
                      <Icon size={18} />
                    </span>
                  </div>
                  <div className="col-span-10">
                    <h3
                      style={{ fontFamily: "'Krona One', sans-serif" }}
                      className="text-2xl md:text-3xl font-light text-foreground mb-3 group-hover:text-accent transition-colors duration-200"
                    >
                      {m.title}
                    </h3>
                    <p className="text-muted-foreground light:text-foreground text-sm leading-relaxed">{m.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
