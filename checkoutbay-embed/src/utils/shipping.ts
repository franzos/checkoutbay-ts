/**
 * Shipping utilities
 */

import type { PublicShippingRate } from '@gofranz/checkoutbay-common';

/**
 * Calculate shipping cost for a given country and order value
 */
export function calculateShippingCost(
  shippingRates: PublicShippingRate[],
  country: string,
  orderValue: number
): number {
  // Stub implementation - returns 0 for now
  return 0;
}

/**
 * Get available shipping methods for a country
 */
export function getAvailableShippingMethods(
  shippingRates: PublicShippingRate[],
  country: string
): PublicShippingRate[] {
  return shippingRates.filter(rate => 
    rate.rates.some(r => r.countries.includes(country))
  );
}