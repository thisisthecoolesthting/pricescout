import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 ${className}`.trim()}>
      <div className="container-pricescout">{children}</div>
    </section>
  );
}
