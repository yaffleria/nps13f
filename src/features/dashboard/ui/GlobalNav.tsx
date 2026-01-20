"use client";

import { useCurrencyStore } from "@/shared/model/use-currency-store";
import { Search, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

interface GlobalNavProps {
  onSearch: (term: string) => void;
}

export function GlobalNav({ onSearch }: GlobalNavProps) {
  const { currency, toggleCurrency } = useCurrencyStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NPS Tracker
            </span>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="티커 검색 (예: TSLA, NVDA)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCurrency}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currency === "KRW" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                ₩
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currency === "USD" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                $
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currency}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
