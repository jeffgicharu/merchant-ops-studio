export const moneyFormatter = new Intl.NumberFormat("en-KE", {
  maximumFractionDigits: 0
});

export const compactMoneyFormatter = new Intl.NumberFormat("en-KE", {
  notation: "compact",
  maximumFractionDigits: 1
});

export const compactNumberFormatter = new Intl.NumberFormat("en-KE", {
  notation: "compact",
  maximumFractionDigits: 1
});

export function formatMoney(value: number, currency = "KES") {
  return `${currency} ${moneyFormatter.format(value)}`;
}

export function formatCompactMoney(value: number, currency = "KES") {
  return `${currency} ${compactMoneyFormatter.format(value)}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}
