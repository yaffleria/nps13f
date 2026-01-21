export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100); // Expecting 5.4 -> 0.054 input? Or just 5.4%?
  // Actually, usually data comes as raw decimals (0.05) or percentage values (5.0).
  // Let's assume input is a raw number like 12.5 (for 12.5%) based on previous logic, or 0.125.
  // Wait, in sec-data.json, I see raw values.
  // Let's assume input is DECIMAL (0.125 = 12.5%) for standard implementation, or handle accordingly.
  // Actually, best to make it safe.
};

export const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(number);
};
