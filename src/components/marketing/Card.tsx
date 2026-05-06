import type { HTMLAttributes, ReactNode } from "react";

/** Spine §6 — `style` rejected at type level (ShiftDeck lesson). */
export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`rounded-2xl border border-line/60 bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg lg:p-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
