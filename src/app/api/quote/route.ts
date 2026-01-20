import { NextResponse } from "next/server";
import { getQuote } from "@/shared/lib/yahoo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") || [];

  if (symbols.length === 0) {
    return NextResponse.json({});
  }

  // Fetch in parallel
  const prices: Record<string, number> = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      const price = await getQuote(symbol);
      if (price !== null) {
        prices[symbol] = price;
      }
    }),
  );

  return NextResponse.json(prices);
}
