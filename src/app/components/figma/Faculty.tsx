import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { courses } from "../../data";

interface ProfesorCard {
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  avatar_url: string | null;
  courseCount: number;
}

export default function Faculty() {
  const [profesores, setProfesores] = useState<ProfesorCard[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("profesor_slug, name, specialty, bio, avatar_url")
      .eq("role", "profesor")
      .not("profesor_slug", "is", null)
      .order("name")
      .then(({ data }) => {
        const mapped = (data ?? []).map((p) => ({
          slug: p.profesor_slug!,
          name: p.name,
          specialty: p.specialty ?? "",
          bio: p.bio ?? "",
          avatar_url: p.avatar_url,
          courseCount: courses.filter((c) => c.profesorSlug === p.profesor_slug).length,
        }));
        setProfesores(mapped);
      });
  }, []);

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
          {profesores.map((f) => (
            <div key={f.slug} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-5">
                {f.avatar_url ? (
                  <img
                    src={f.avatar_url}
                    alt={f.name}
                    className="w-full h-full object-cover grayscale opacity-75 transition-all duration-700 group-hover:opacity-90 group-hover:grayscale-0 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-end justify-start p-4 bg-secondary">
                    <span
                      className="text-4xl font-light text-muted-foreground"
                      style={{ fontFamily: "'Krona One', sans-serif" }}
                    >
                      {f.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span
                    className="text-xs text-foreground/60 tracking-widest uppercase bg-background/50 backdrop-blur-sm px-2 py-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {f.courseCount} {f.courseCount === 1 ? "curso" : "cursos"}
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
                {f.specialty}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
