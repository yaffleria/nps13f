"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PortfolioQuarter } from "@/entities/portfolio/types";

interface QuarterSelectorProps {
  quarters: PortfolioQuarter[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function QuarterSelector({ quarters, selectedIndex, onSelect }: QuarterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = quarters[selectedIndex];
  const canGoNewer = selectedIndex > 0;
  const canGoOlder = selectedIndex < quarters.length - 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      <button
        onClick={() => canGoOlder && onSelect(selectedIndex + 1)}
        disabled={!canGoOlder}
        className="p-2 rounded-lg bg-surface border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
        title="Previous Quarter"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border hover:bg-background hover:border-primary/50 transition-all min-w-[140px] justify-between"
        >
          <span className="font-semibold text-foreground">
            {current.year} Q{current.quarter}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {quarters.map((q, idx) => (
                <button
                  key={`${q.year}-${q.quarter}`}
                  onClick={() => {
                    onSelect(idx);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-background transition-colors ${
                    idx === selectedIndex
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground"
                  }`}
                >
                  <span>
                    {q.year} Q{q.quarter}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold">
                      LATEST
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => canGoNewer && onSelect(selectedIndex - 1)}
        disabled={!canGoNewer}
        className="p-2 rounded-lg bg-surface border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
        title="Next Quarter"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
