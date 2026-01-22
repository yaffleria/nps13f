export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(number);
};
