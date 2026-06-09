import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { testimonials } from "../../data";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-border bg-secondary light:bg-background">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4">
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-6"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              06 / Alumnos
            </span>
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-4xl font-light text-foreground leading-tight"
            >
              Lo que dicen
              <br />
              <span>quienes pasaron</span>
              <br />
              por aquí
            </h2>
            <div className="flex items-center gap-3 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-px transition-all duration-300 ${
                    i === active ? "w-10 bg-accent" : "w-5 bg-border"
                  }`}
                  aria-label={`Ver testimonio ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 relative min-h-[340px] md:min-h-[260px] lg:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <blockquote
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="text-2xl md:text-3xl font-light text-foreground leading-snug"
                >
                  "{testimonials[active].quote}"
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <span className="w-8 h-px bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonials[active].name}</p>
                    <p
                      className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {testimonials[active].program}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
