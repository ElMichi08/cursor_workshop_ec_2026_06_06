const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;
  return `${currencyFormatter.format(dollars)} fake`;
}
