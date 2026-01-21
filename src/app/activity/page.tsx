import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { ActivityTable } from "@/features/activity/ActivityTable";
import { processActivity } from "@/entities/portfolio/lib/process-activity";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "NPS 13F Activity | Recent Buys & Sells",
  description:
    "Recent buying and selling activity of the National Pension Service (NPS) in the US stock market.",
};

async function getPortfolioData() {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data: PortfolioQuarter[] = JSON.parse(fileContent);
  return data;
}

export default async function ActivityPage() {
  const data = await getPortfolioData();
  const currentQuarter = data[0];
  const previousQuarter = data.length > 1 ? data[1] : undefined;

  // Process data to find changes
  const activity = processActivity(currentQuarter, previousQuarter);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Portfolio Activity</h1>
            <p className="text-secondary">
              Changes from{" "}
              <span className="font-semibold text-foreground">
                {previousQuarter?.year} Q{previousQuarter?.quarter}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {currentQuarter?.year} Q{currentQuarter?.quarter}
              </span>
              .
            </p>
          </div>

          {activity.length > 0 ? (
            <ActivityTable activity={activity} />
          ) : (
            <div className="text-center py-20 text-secondary bg-surface rounded-xl border border-border">
              No activity data available or no changes detected.
            </div>
          )}
        </FadeIn>
      </main>

      <footer className="border-t border-border py-8 mt-12 text-center text-sm text-muted">
        <p>© 2025 NPS 13F Tracker. Not affiliated with the National Pension Service.</p>
      </footer>
    </div>
  );
}
