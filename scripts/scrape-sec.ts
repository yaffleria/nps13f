import fs from "fs/promises";
import path from "path";

// --- Constants & Types from api.ts ---

const SEC_SUBMISSIONS_URL = "https://data.sec.gov";
const SEC_ARCHIVES_URL = "https://www.sec.gov";
const NPS_CIK = "0001608046"; // National Pension Service (Korea) CIK
const SEC_USER_AGENT = "NPS_Portfolio_Tracker/1.0 (contact@nps-tracker-demo.com)";

// Cache paths
const DATA_DIR = path.join(process.cwd(), "src/shared/data");
const TICKER_CACHE_PATH = path.join(DATA_DIR, "ticker-cache.json");

// Interface for Ticker Cache
interface TickerCacheEntry {
  symbol: string;
  securityName: string;
  sector?: string;
}

interface TickerCache {
  [cusip: string]: TickerCacheEntry;
}

// Global cache object
let tickerCache: TickerCache = {};

// Helper to load cache
async function loadTickerCache() {
  try {
    const data = await fs.readFile(TICKER_CACHE_PATH, "utf-8");
    tickerCache = JSON.parse(data);
    console.log(`Loaded ${Object.keys(tickerCache).length} entries from ticker cache.`);
  } catch {
    console.log("No existing ticker cache found, starting fresh.");
    tickerCache = {};
  }
}

// ...

// Helper to save cache
async function safeTickerCache() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(TICKER_CACHE_PATH, JSON.stringify(tickerCache, null, 2));
    console.log("Ticker cache saved.");
  } catch (err: unknown) {
    console.error("Failed to save ticker cache:", err);
  }
}

// ...

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryYahooFinance(query: string): Promise<any | null> {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
  try {
    // Add small delay to avoid rate limits during heavy processing
    await delay(100);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const quotes = data.quotes || [];

    // Filter for Equity or ETF
    const equity = quotes.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (q: any) =>
        (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "MUTUALFUND") &&
        q.isYahooFinance,
    );

    return equity || quotes[0] || null;
  } catch (e) {
    console.warn(`Yahoo lookup failed for ${query}:`, e);
    return null;
  }
}

async function parse13FXML(accessionNumber: string): Promise<Filing13F[]> {
  const formattedAccession = accessionNumber.replace(/-/g, "");
  const cikTrimmed = NPS_CIK.replace(/^0+/, "");
  const baseUrl = `${SEC_ARCHIVES_URL}/Archives/edgar/data/${cikTrimmed}/${formattedAccession}`;

  // Fetch filing directory index
  const indexUrl = `${baseUrl}/index.json`;
  console.log(`Fetching index from ${indexUrl}...`);
  const indexResponse = await fetch(indexUrl, {
    headers: {
      "User-Agent": SEC_USER_AGENT,
      "Accept-Encoding": "gzip, deflate",
      Host: "www.sec.gov",
    },
  });

  if (!indexResponse.ok) {
    throw new Error(`Failed to fetch filing index: ${indexResponse.statusText}`);
  }

  const indexData = await indexResponse.json();
  const items = indexData.directory?.item || [];

  // Heuristic to find the correct XML file (Information Table)
  const xmlFiles = items.filter(
    (item: { name: string }) =>
      item.name.endsWith(".xml") &&
      !item.name.includes("primary_doc") &&
      !item.name.includes("xsl") &&
      !item.name.includes("header"),
  );

  let infoTableFile = xmlFiles.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) =>
      item.name.toLowerCase().includes("infotable") ||
      item.name.toLowerCase().includes("informationtable"),
  );

  // Fallback
  if (!infoTableFile && xmlFiles.length > 0) {
    infoTableFile = xmlFiles[0];
  }

  if (!infoTableFile) {
    throw new Error("Could not find infotable XML in filing directory");
  }

  const xmlUrl = `${baseUrl}/${infoTableFile.name}`;
  console.log(`Fetching XML from ${xmlUrl}...`);
  const xmlResponse = await fetch(xmlUrl, {
    headers: {
      "User-Agent": SEC_USER_AGENT,
      "Accept-Encoding": "gzip, deflate",
      Host: "www.sec.gov",
    },
  });

  if (!xmlResponse.ok) {
    throw new Error(`Failed to fetch XML ${xmlUrl}: ${xmlResponse.statusText}`);
  }

  const xmlText = await xmlResponse.text();
  const rawHoldings = parseHoldingsFromXML(xmlText);

  // Resolve tickers using Yahoo Finance
  return resolveHoldingsTickers(rawHoldings);
}

async function scrape() {
  await loadTickerCache();

  try {
    const submission = await fetchSECSubmissions();
    const { recent } = submission.filings;

    const filingsToProcess: {
      year: number;
      quarter: number;
      date: string;
      accessionNumber: string;
    }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);

    if (recent.form) {
      for (let i = 0; i < recent.form.length; i++) {
        const formType = recent.form[i];
        if (formType === "13F-HR" || formType === "13F-HR/A") {
          const reportDate = recent.reportDate[i];
          const [year, month] = reportDate.split("-").map(Number);

          let quarter: number;
          if (month <= 3) quarter = 1;
          else if (month <= 6) quarter = 2;
          else if (month <= 9) quarter = 3;
          else quarter = 4;

          // Filter out future filings
          if (year > currentYear) continue;
          if (year === currentYear && quarter > currentQuarter) continue;

          filingsToProcess.push({
            year,
            quarter,
            date: recent.filingDate[i],
            accessionNumber: recent.accessionNumber[i],
          });
        }
      }
    }

    // Deduplicate and Sort
    const seen = new Set<string>();
    const uniqueFilings = filingsToProcess
      .filter((f) => {
        const key = `${f.year}-Q${f.quarter}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.quarter - a.quarter;
      });

    // Limit to make sure we don't hammer APIs too hard, but get good data
    // 8 quarters = 2 years
    const filingsToFetch = uniqueFilings.slice(0, 8);

    console.log(`Found ${filingsToFetch.length} filings to process.`);

    const allData: FilingPeriod[] = [];

    for (const filing of filingsToFetch) {
      console.log(`Processing ${filing.year} Q${filing.quarter}...`);

      try {
        const holdings = await parse13FXML(filing.accessionNumber);
        const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

        allData.push({
          date: filing.date,
          year: filing.year,
          quarter: filing.quarter,
          totalValue,
          holdings,
        });
      } catch (err) {
        console.error(`Failed to process ${filing.year} Q${filing.quarter}:`, err);
      }
    }

    const outputPath = path.join(DATA_DIR, "sec-data.json");
    await fs.writeFile(outputPath, JSON.stringify(allData, null, 2));
    console.log(`Successfully saved data to ${outputPath}`);

    // Final save of cache
    await saveTickerCache();
  } catch (error) {
    console.error("Scrape failed:", error);
    process.exit(1);
  }
}

scrape();
