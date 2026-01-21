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
  } catch (e) {
    console.log("No existing ticker cache found, starting fresh.");
    tickerCache = {};
  }
}

// Helper to save cache
async function saveTickerCache() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(TICKER_CACHE_PATH, JSON.stringify(tickerCache, null, 2));
    console.log("Ticker cache saved.");
  } catch (e) {
    console.error("Failed to save ticker cache:", e);
  }
}

// Helper to delay (rate limiting)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolve Ticker from CUSIP or Name using Yahoo Finance API
 */
async function resolveTicker(
  cusip: string,
  nameOfIssuer: string,
): Promise<TickerCacheEntry | null> {
  // 1. Check Cache
  if (tickerCache[cusip]) {
    return tickerCache[cusip];
  }

  // 2. Query Yahoo Finance
  // Try CUSIP first as it's more specific
  let result = await queryYahooFinance(cusip);

  // 3. Fallback to Name search if CUSIP failed
  if (!result || !result.symbol) {
    // Clean up name for better search results
    const cleanName = nameOfIssuer
      .replace(/\s+/g, " ")
      .replace(/ CORPORATION| CORP\.?| INC\.?| COMPANY| CO\.?| PLC| LTD\.?| AG| SA/gi, "")
      .trim();

    // Heuristic: If name is too short, might be ambiguous, but let's try
    result = await queryYahooFinance(cleanName);
  }

  if (result && result.symbol) {
    const entry: TickerCacheEntry = {
      symbol: result.symbol,
      securityName: result.shortname || result.longname || nameOfIssuer,
      sector: result.sector || "Other",
    };

    // Save to cache
    tickerCache[cusip] = entry;
    // We auto-save periodically or at end, but here we can just update memory
    return entry;
  }

  // Return null if resolution failed
  // We might want to cache "not found" to avoid re-querying?
  // For now let's just return null and fallback to basic heuristics later.
  return null;
}

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

interface SECSubmission {
  cik: string;
  name: string;
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      reportDate: string[];
      form: string[];
      primaryDocument: string[];
    };
  };
}

interface Filing13F {
  symbol: string;
  securityName: string;
  sector?: string; // Enhanced field
  cusip: string;
  shares: number;
  value: number; // in USD
  putCallShare: "PUT" | "CALL" | "SHARE" | null;
  investmentDiscretion: string;
  votingAuthority: {
    sole: number;
    shared: number;
    none: number;
  };
}

interface FilingPeriod {
  date: string;
  year: number;
  quarter: number;
  totalValue: number;
  holdings: Filing13F[];
}

// --- Fetch Functions ---

async function fetchSECSubmissions(): Promise<SECSubmission> {
  const url = `${SEC_SUBMISSIONS_URL}/submissions/CIK${NPS_CIK}.json`;
  console.log(`Fetching submissions from ${url}...`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": SEC_USER_AGENT,
      "Accept-Encoding": "gzip, deflate",
      Host: "data.sec.gov",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SEC submissions: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper to batch process ticker resolution
async function resolveHoldingsTickers(holdings: Filing13F[]): Promise<Filing13F[]> {
  console.log(`Resolving tickers for ${holdings.length} holdings...`);

  const resolvedHoldings: Filing13F[] = [];

  // improved concurrency control (batches of 10)
  const batchSize = 10;
  for (let i = 0; i < holdings.length; i += batchSize) {
    const batch = holdings.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (holding) => {
        // Skip if we somehow already have a good symbol (unlikely from raw XML except heuristic)
        // Actually, parseHoldingsFromXML only did basic extraction.

        const { cusip, securityName } = holding;
        const resolved = await resolveTicker(cusip, securityName);

        if (resolved) {
          return {
            ...holding,
            symbol: resolved.symbol,
            securityName: resolved.securityName, // Use standardized name
            sector: resolved.sector,
          };
        } else {
          // Fallback: Use truncated name as pseudo-symbol
          let symbol = securityName.split(" ")[0].replace(/[^A-Z]/g, "");
          if (symbol.length > 5) symbol = symbol.substring(0, 5);
          if (symbol.length === 0) symbol = "UNK";

          return { ...holding, symbol };
        }
      }),
    );

    resolvedHoldings.push(...batchResults);
    process.stdout.write(`.`); // progress indicator
  }
  console.log(" Done.");

  // Save cache after each quarter/batch to be safe
  await saveTickerCache();

  return resolvedHoldings;
}

function parseHoldingsFromXML(xml: string): Filing13F[] {
  const holdings: Filing13F[] = [];

  // Remove namespaces
  const cleanXml = xml.replace(/<(\/?)(?:\w+:)?([a-zA-Z0-9]+)/g, "<$1$2");

  // Regex to iterate over each infoTable entry
  const entryRegex = /<infoTable[^>]*>([\s\S]*?)<\/infoTable>/gi;
  let match;

  while ((match = entryRegex.exec(cleanXml)) !== null) {
    const entry = match[1];

    const getValue = (tag: string): string => {
      const tagRegex = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "i");
      const m = entry.match(tagRegex);
      return m ? m[1].trim() : "";
    };

    const nameOfIssuer = getValue("nameOfIssuer");
    const valueStr = getValue("value");
    const sharesStr = getValue("sshPrnamt");
    const cusip = getValue("cusip");

    if (!nameOfIssuer || !valueStr) continue;

    const value = parseInt(valueStr) || 0;
    const shares = parseInt(sharesStr) || 0;

    holdings.push({
      symbol: "", // Placeholder, will be resolved later
      securityName: nameOfIssuer,
      cusip,
      shares,
      value: value * 1000,
      putCallShare: (getValue("putCall") || "SH") as Filing13F["putCallShare"],
      investmentDiscretion: getValue("investmentDiscretion"),
      votingAuthority: {
        sole: parseInt(getValue("Sole")) || 0,
        shared: parseInt(getValue("Shared")) || 0,
        none: parseInt(getValue("None")) || 0,
      },
    });
  }

  return holdings;
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
