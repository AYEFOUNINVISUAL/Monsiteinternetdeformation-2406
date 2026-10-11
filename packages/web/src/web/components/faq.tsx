import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqEntry = { question: string; answer: string };

export function Faq({ entries }: { entries: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {entries.map((entry, index) => {
        const isOpen = open === index;
        return (
          <div className="faq__item" data-open={isOpen} key={entry.question}>
            <button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {entry.question}
              <ChevronDown size={17} />
            </button>
            <div className="faq__a">
              <p>{entry.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
