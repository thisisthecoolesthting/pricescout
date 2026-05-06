import Link from "next/link";

export function RelatedBlock({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
      <ul className="space-y-2 text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium text-mint-600 underline underline-offset-4 hover:text-mint-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
