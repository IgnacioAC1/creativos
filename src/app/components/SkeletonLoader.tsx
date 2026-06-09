interface SkeletonLoaderProps {
  count?: number;
  variant?: "card" | "row" | "text";
}

export default function SkeletonLoader({
  count = 3,
  variant = "card",
}: SkeletonLoaderProps) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-card border border-border overflow-hidden flex flex-col animate-pulse">
            <div className="aspect-[16/9] bg-secondary" />
            <div className="p-6 flex flex-col flex-1 gap-3">
              <div className="h-3 bg-secondary rounded w-1/3" />
              <div className="h-6 bg-secondary rounded w-2/3" />
              <div className="h-3 bg-secondary rounded w-full mt-auto" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className="border border-border">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-6 py-4 animate-pulse ${
              i < count - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-16 h-12 bg-secondary rounded flex-shrink-0 hidden sm:block" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-secondary rounded w-1/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
            <div className="h-8 bg-secondary rounded w-24 flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}
