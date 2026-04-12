import { ReactNode } from "react";

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
    <section className={`scribble-border rounded-4xl bg-white/75 p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
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
