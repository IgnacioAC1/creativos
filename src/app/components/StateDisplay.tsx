import { ReactNode } from "react";
import { AlertCircle, Loader2, LucideIcon } from "lucide-react";

interface StateDisplayProps {
  state: "empty" | "loading" | "error";
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function StateDisplay({
  state,
  title,
  description,
  icon: Icon,
  action,
}: StateDisplayProps) {
  const getIcon = () => {
    if (Icon) return <Icon size={48} className="text-muted-foreground mb-4" />;

    if (state === "loading") {
      return <Loader2 size={48} className="text-accent mb-4 animate-spin" />;
    }
    if (state === "error") {
      return <AlertCircle size={48} className="text-red-500 mb-4" />;
    }
    return null;
  };

  const getContainerClass = () => {
    const base = "flex flex-col items-center justify-center py-24 px-6 border border-border rounded-sm";
    if (state === "loading") return base + " bg-secondary/30";
    return base;
  };

  return (
    <div className={getContainerClass()}>
      {getIcon()}
      <h3
        style={{ fontFamily: "'Krona One', sans-serif" }}
        className="text-lg font-light text-foreground mb-2 text-center"
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-accent text-accent hover:bg-accent hover:text-accent-foreground px-6 py-3 transition-all"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
