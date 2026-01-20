const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getQuote(symbol: string): Promise<number | null> {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 300 }, // Cache for 5 mins
    });

    if (!res.ok) return null;

    const data = await res.json();
    const quotes = data.quotes || [];

    // Attempt to find exact match
    const quote = quotes.find((q: any) => q.symbol === symbol) || quotes[0];

    // This search API returns metadata, NOT current price often?
    // Wait, query2 search API returns 'regularMarketPrice' sometimes?
    // Using `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` is better for price.

    return await getChartPrice(symbol);
  } catch (e) {
    console.warn(`Yahoo lookup failed for ${symbol}:`, e);
    return null;
  }
}

async function getChartPrice(symbol: string): Promise<number | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const result = data.chart?.result?.[0];
    return result?.meta?.regularMarketPrice || null;
  } catch (e) {
    return null;
  }
}
