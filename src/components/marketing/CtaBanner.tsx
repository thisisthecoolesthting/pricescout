import Link from "next/link";

export function CtaBanner({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Link href={primaryHref} className="btn-primary btn-large">
        {primaryLabel}
      </Link>
      <Link href={secondaryHref} className="btn-secondary btn-large">
        {secondaryLabel}
      </Link>
    </div>
  );
}
