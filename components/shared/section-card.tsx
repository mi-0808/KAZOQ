import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = ""
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl bg-white/78 p-4 sm:scribble-border sm:rounded-4xl sm:p-5", className)}>
      <div className="mb-3 flex items-start justify-between gap-4 sm:mb-4">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle ? <p className="section-subtitle mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
