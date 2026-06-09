import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { events } from "../../data";
import EventCard from "./EventCard";
import EventSignupModal from "../EventSignupModal";

type FilterType = "todos" | "online" | "presencial";

export default function Events() {
  const [eventFilter, setEventFilter] = useState<FilterType>("todos");
  const [modalEvent, setModalEvent] = useState<string | null>(null);

  const filteredEvents =
    eventFilter === "todos" ? events : events.filter((e) => e.type === eventFilter);

  return (
    <section id="eventos" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 border-b border-border pb-8">
          <div>
            <span
              className="text-xs text-accent tracking-widest uppercase block mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              03 / Eventos
            </span>
            <h2
              style={{ fontFamily: "'Krona One', sans-serif" }}
              className="text-4xl md:text-5xl font-light text-foreground"
            >
              En directo contigo
            </h2>
          </div>
          <div className="flex items-center gap-1 border border-border p-1">
            {(["todos", "online", "presencial"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setEventFilter(f)}
                className={`text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200 ${
                  eventFilter === f
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {eventFilter === "todos" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <EventCard
              ev={events[0]}
              className="md:col-span-7"
              imageAspect="aspect-[16/10]"
              onReservar={setModalEvent}
            />
            <EventCard
              ev={events[1]}
              className="md:col-span-5"
              imageAspect="aspect-[4/5]"
              onReservar={setModalEvent}
            />

            {/* Evento destacado — full width horizontal */}
            <div className="md:col-span-12 group bg-card border border-border hover:border-accent/40 transition-colors duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden relative flex-shrink-0">
                  <img
                    src={events[2].image}
                    alt={events[2].alt}
                    className="w-full h-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 hidden md:block" />
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span
                      className="text-xs tracking-widest uppercase px-3 py-1.5 bg-accent text-accent-foreground"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      ● Presencial
                    </span>
                    <span
                      className="text-xs tracking-widest uppercase px-3 py-1.5 bg-background/80 backdrop-blur-sm text-foreground"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {events[2].price}
                    </span>
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-between p-8 md:p-12">
                  <div>
                    <span
                      className="text-xs text-accent tracking-widest uppercase block mb-6"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Evento destacado
                    </span>
                    <div
                      className="flex items-center gap-4 text-xs text-muted-foreground tracking-widest uppercase mb-5"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {events[2].date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {events[2].location}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Krona One', sans-serif",
                        fontSize: "clamp(28px, 3vw, 44px)",
                        lineHeight: 1.05,
                        fontWeight: 300,
                      }}
                      className="text-foreground mb-5 group-hover:text-accent transition-colors duration-200"
                    >
                      {events[2].title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                      {events[2].description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <p className="text-sm text-foreground font-medium">{events[2].instructor}</p>
                      <p
                        className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {events[2].seats}
                      </p>
                    </div>
                    <button
                      onClick={() => setModalEvent(events[2].title)}
                      className="group/btn inline-flex items-center gap-2 text-xs tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3.5 transition-all duration-200"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Reservar plaza
                      <ArrowUpRight
                        size={12}
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <EventCard
              ev={events[3]}
              className="md:col-span-7"
              imageAspect="aspect-[16/9]"
              onReservar={setModalEvent}
            />

            {/* CTA newsletter */}
            <div className="md:col-span-5 bg-accent flex flex-col justify-between p-8 min-h-[280px]">
              <span
                className="text-xs text-accent-foreground/60 tracking-widest uppercase"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Comunidad
              </span>
              <div>
                <p
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                  className="text-3xl md:text-4xl font-light text-accent-foreground leading-tight mb-6"
                >
                  ¿Quieres saber antes que nadie cuándo hay eventos?
                </p>
                <div className="flex gap-0">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-3 text-sm bg-accent-foreground/10 border border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/40 outline-none focus:border-accent-foreground/60 transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                  <button
                    className="px-5 py-3 bg-accent-foreground text-accent text-xs tracking-widest uppercase hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Avísame
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard ev={ev} className="" imageAspect="aspect-[16/9]" onReservar={setModalEvent} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <EventSignupModal
        eventTitle={modalEvent ?? ""}
        open={!!modalEvent}
        onClose={() => setModalEvent(null)}
      />
    </section>
  );
}
