import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Link } from "react-router";

const STATS = [
  ["4", "cursos"],
  ["150+", "lecciones"],
  ["480+", "alumnos"],
  ["94%", "satisfacción"],
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={sectionRef} className="min-h-screen pt-16 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: bgY, scale: bgScale }}
        >
          <img
            src="/hero.jpg"
            alt="Ondas de diseño"
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/95" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12 flex-1 flex flex-col py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-16 pb-5 border-b border-accent/30"
        >
          <div
            className="flex items-center gap-5 text-sm tracking-[0.15em] uppercase text-accent"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <span>● 150+ lecciones en vídeo</span>
            <span className="hidden md:inline">● Online + Presencial</span>
          </div>
          <span
            className="hidden md:block text-[10px] tracking-[0.2em] uppercase text-accent"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Nuevos cursos
          </span>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Krona One', sans-serif",
              fontSize: "clamp(68px, 11vw, 180px)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              fontWeight: 400,
            }}
            className="text-foreground uppercase mb-10"
          >
            Aprende
            <br />
            <span className="text-accent">Mejora</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-foreground max-w-2xl leading-relaxed border-l-2 border-accent pl-6 mb-12"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}
          >
            Formación especializada en diseño gráfico, branding y comunicación visual.
            <br />
            <span className="text-muted-foreground">Para profesionales que quieren subir de nivel.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <Link
              to="/cursos"
              className="group inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-all duration-200 px-8 py-5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Ver cursos
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              />
            </Link>
            <Link
              to="/eventos"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase border-2 border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-5 transition-all duration-200"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Eventos
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-auto"
        >
          <div className="md:col-span-5 bg-accent flex flex-col justify-center p-8 md:p-10">
            <p
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-accent-foreground text-2xl md:text-3xl leading-tight"
            >
              "El criterio no se instala. Se cultiva."
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {STATS.map(([num, label]) => (
              <div
                key={label}
                className="bg-background/80 backdrop-blur-sm border border-border p-4 flex flex-col justify-between"
              >
                <div
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="text-4xl md:text-5xl font-light text-accent leading-none"
                >
                  {num}
                </div>
                <div
                  className="text-[9px] text-muted-foreground tracking-[0.18em] uppercase mt-2"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-accent" />
        </motion.div>
      </div>
    </section>
  );
}
