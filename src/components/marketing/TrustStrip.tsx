export function TrustStrip({ items }: { items: string[] }) {
  return (
    <p className="text-sm font-medium text-soft">
      {items.join(" · ")}
    </p>
  );
}
