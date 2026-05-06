"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, idx) => (
        <FAQRow key={idx} item={item} />
      ))}
    </div>
  );
}

function FAQRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`mb-4 overflow-hidden rounded-xl border transition-colors duration-300 ${
        open ? "border-mint-500" : "border-line"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 bg-white p-6 text-left transition-colors hover:bg-cream"
      >
        <h3 className="text-base font-semibold text-ink">{item.q}</h3>
        <Plus
          aria-hidden
          className={`h-5 w-5 flex-none text-mint-500 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</div>
        </div>
      </div>
    </div>
  );
}
