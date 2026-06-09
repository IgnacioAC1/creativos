import { motion } from "motion/react";

const ITEMS = ["Identidad Visual", "Tipografía", "Diseño Web", "Dirección de Arte", "Eventos en Vivo"];

export default function Ticker() {
  return (
    <div className="border-y border-border py-4 overflow-hidden">
      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap w-max"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-10 text-xs tracking-widest uppercase text-muted-foreground"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {ITEMS.map((item, j) => (
              <>
                <span key={item}>{item}</span>
                {j < ITEMS.length - 1 && (
                  <span key={`sep-${item}`} className="text-accent">✦</span>
                )}
              </>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
