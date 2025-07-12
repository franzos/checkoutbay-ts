import { LOCAL_STORAGE_SHOP_KEY } from "../constants";
import { Shop } from "../types";

export function getLsShop(): Shop | null {
  const ls = localStorage.getItem(LOCAL_STORAGE_SHOP_KEY);
  if (!ls) {
    return null;
  }
  return JSON.parse(ls);
}

export function setLsShop(shop: Shop) {
  localStorage.setItem(LOCAL_STORAGE_SHOP_KEY, JSON.stringify(shop));
}

export function clearLsShop() {
  localStorage.removeItem(LOCAL_STORAGE_SHOP_KEY);
}