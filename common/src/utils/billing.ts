import { Balance } from "../types";

export function balanceNextHigher(bal: Balance) {
  if (bal[1] === 0) {
    return bal[1];
  }
  // Convert vfiat to EUR (1 EUR = 100,000 vfiat) - matches rusty-common
  return bal[1] / 100000;
}

export function formatCurrency(bal: Balance) {
  return `${bal[0]} ${balanceNextHigher(bal)}`;
}
