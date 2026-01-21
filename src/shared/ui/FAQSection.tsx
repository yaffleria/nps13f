"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export function FAQSection({ items, title = "자주 묻는 질문" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // FAQPage JSON-LD 생성
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-8 mb-8 p-6 bg-surface/30 rounded-2xl border border-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="text-xl font-bold mb-5 text-foreground">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-background/50 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-foreground pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 300ms ease-out",
                }}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 pt-2 text-secondary leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
