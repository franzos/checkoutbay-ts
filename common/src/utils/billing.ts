import { Balance } from "../types";

export function balanceNextHigher(bal: Balance) {
  if (bal[1] === 0) {
    return bal[1];
  }
  return bal[1] / 100 / 1000;
}

export function formatCurrency(bal: Balance) {
  return `${bal[0]} ${balanceNextHigher(bal)}`;
}
