import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted-foreground/15 skeleton-shimmer",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
