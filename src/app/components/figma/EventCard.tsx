import { ArrowUpRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import { events } from "../../data";

export type EventType = (typeof events)[number];

export default function EventCard({
  ev,
  className,
  imageAspect,
  onReservar,
}: {
  ev: EventType;
  className: string;
  imageAspect: string;
  onReservar?: (eventTitle: string) => void;
}) {
  return (
    <div
      className={`${className} group bg-card border border-border hover:border-accent/40 transition-colors duration-300 overflow-hidden flex flex-col`}
    >
      <div className={`${imageAspect} overflow-hidden relative flex-shrink-0`}>
        <img
          src={ev.image}
          alt={ev.alt}
          className="w-full h-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`text-xs tracking-widest uppercase px-3 py-1.5 ${
              ev.type === "online"
                ? "bg-background/80 text-accent backdrop-blur-sm"
                : "bg-accent text-accent-foreground"
            }`}
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {ev.type === "online" ? "● Online" : "● Presencial"}
          </span>
          <span
            className="text-xs tracking-widest uppercase px-3 py-1.5 bg-background/80 backdrop-blur-sm text-foreground"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {ev.price}
          </span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-1">
        <div
          className="flex items-center gap-4 text-xs text-muted-foreground tracking-widest uppercase mb-4"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            {ev.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {ev.time}
          </span>
        </div>

        <h3
          style={{ fontFamily: "'Krona One', sans-serif" }}
          className="text-2xl font-light text-card-foreground mb-3 group-hover:text-accent transition-colors duration-200"
        >
          {ev.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{ev.description}</p>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
          <div>
            <p
              className="text-xs text-muted-foreground tracking-widest uppercase"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {ev.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} />
                  {ev.location}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Users size={11} />
                  {ev.seats}
                </span>
              )}
            </p>
            <p
              className="text-xs text-muted-foreground tracking-widest uppercase mt-1"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Con {ev.instructor}
            </p>
          </div>
          <button
            onClick={() => onReservar?.(ev.title)}
            className="group/btn inline-flex items-center gap-2 text-xs tracking-widest uppercase border border-card-foreground/30 text-card-foreground hover:border-accent hover:text-accent px-4 py-2.5 transition-all duration-200"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Reservar
            <ArrowUpRight
              size={12}
              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
