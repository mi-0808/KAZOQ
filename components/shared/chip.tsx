import { cn } from "@/lib/utils";

export function Chip({
  children,
  color = "bg-cream text-ink"
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", color)}>{children}</span>;
}
