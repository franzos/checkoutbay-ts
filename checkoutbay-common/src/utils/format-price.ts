import Decimal from "decimal.js";

export const formatPrice = (
  amount: Decimal | number | undefined | null,
  currency: string = "USD"
): string => {
  if (!amount) return `${currency} 0.00`;

  const value = amount instanceof Decimal ? amount : new Decimal(amount);

  // Format based on currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value.toNumber());
};
