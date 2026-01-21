import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { PortfolioSummary } from "@/features/portfolio/PortfolioSummary";
import { HoldingsTable } from "@/features/holdings/HoldingsTable";
import { SectorChart } from "@/widgets/charts/SectorChart";
import { StockPosition, PortfolioQuarter } from "@/entities/portfolio/types";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "NPS 13F Portfolio | National Pension Service US Holdings",
  description:
    "Track the National Pension Service (NPS) of Korea's latest 13F filings. View top holdings, sector allocation, and portfolio changes.",
  keywords: [
    "NPS",
    "National Pension Service",
    "13F",
    "Stock Portfolio",
    "Korea",
    "Investment",
    "Finance",
    "Holdings",
  ],
};

async function getPortfolioData() {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data: PortfolioQuarter[] = JSON.parse(fileContent);
  return data;
}

export default async function PortfolioPage() {
  const data = await getPortfolioData();
  const currentQuarter = data[0]; // Latest

  if (!currentQuarter) {
    return (
      <div className="p-8 text-center text-secondary">
        No data available yet. Please run the scraper.
      </div>
    );
  }

  // Calculate update date
  const updateDate = currentQuarter.date;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          {/* Page Title / Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              NPS US Stock Portfolio
            </h1>
            <p className="text-secondary max-w-2xl">
              Analyze the National Pension Service of Korea's latest SEC 13F filings. Total assets
              under management in US equities:{" "}
              <span className="text-foreground font-semibold">
                ${(currentQuarter.totalValue / 1_000_000_000).toFixed(1)}B
              </span>
              .
            </p>
          </div>

          {/* Summary Cards */}
          <PortfolioSummary
            totalValue={currentQuarter.totalValue}
            period={`${currentQuarter.year} Q${currentQuarter.quarter}`}
            count={currentQuarter.holdings.length}
            updateDate={updateDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Charts Area */}
            <div className="lg:col-span-1 bg-surface rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Top Sectors</h3>
              <SectorChart holdings={currentQuarter.holdings} />
            </div>

            {/* Main Table Area */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Holdings</h2>
                {/* Optional: Filter/Sort controls could go here */}
              </div>
              <HoldingsTable
                holdings={currentQuarter.holdings}
                totalValue={currentQuarter.totalValue}
              />
            </div>
          </div>
        </FadeIn>
      </main>

      <footer className="border-t border-border py-8 mt-12 text-center text-sm text-muted">
        <p>© 2025 NPS 13F Tracker. Not affiliated with the National Pension Service.</p>
        <p className="mt-2 text-xs">Data source: SEC Edgar 13F Filings.</p>
      </footer>
    </div>
  );
}
