import { promises as fs } from "fs";
import path from "path";
import { DashboardPage } from "@/views/dashboard/ui/DashboardPage";
import { FilingPeriod } from "@/shared/model/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NPS 13F 대시보드",
  description: "국민연금 13F 포트폴리오 추적기",
  openGraph: {
    images: ["/api/og"], // Dynamic OG Image
  },
};

async function getSECData(): Promise<FilingPeriod[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent) as FilingPeriod[];
    return data;
  } catch (error) {
    console.error(
      "Failed to read SEC data. Make sure to run `npm run scrape`.",
      error,
    );
    return [];
  }
}

export default async function Home() {
  const data = await getSECData();

  return <DashboardPage data={data} />;
}
