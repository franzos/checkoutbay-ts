/**
 * Country and subdivision utilities using rust_iso3166-ts
 */

import { countries as getAllCountriesFromPackage, subdivisions } from 'rust_iso3166-ts';
import type { PublicShippingRate } from '@gofranz/checkoutbay-common';

interface Country {
  name: string;
  alpha2: string;
}

interface Subdivision {
  name: string;
  alpha2: string;
  country: string;
}

interface CountryOption {
  label: string;
  value: string;
  key: string;
}

/**
 * Get filtered countries based on a set of country codes
 */
export function filterCountries(countryCodes: Set<string>): Country[] {
  try {
    const allCountries = getAllCountriesFromPackage();
    return allCountries
      .filter(country => countryCodes.has(country.alpha2.toUpperCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('[CheckoutBay] Error filtering countries:', error);
    return [];
  }
}

/**
 * Get all available countries
 */
export function getAllCountries(): Country[] {
  try {
    return getAllCountriesFromPackage().sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('[CheckoutBay] Error getting countries:', error);
    return getDefaultCountries();
  }
}

/**
 * Get subdivisions (states/provinces) for a specific country
 */
export function getCountrySubdivisions(countryCode: string): Subdivision[] {
  if (!countryCode) return [];
  
  try {
    return subdivisions()
      .filter(subdivision => subdivision.country === countryCode.toUpperCase())
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('[CheckoutBay] Error getting subdivisions:', error);
    return [];
  }
}

/**
 * Get country name by alpha2 code
 */
export function getCountryName(countryCode: string): string {
  if (!countryCode) return '';
  
  try {
    const allCountries = getAllCountriesFromPackage();
    const country = allCountries.find(c => c.alpha2.toUpperCase() === countryCode.toUpperCase());
    return country ? country.name : countryCode;
  } catch (error) {
    console.error('[CheckoutBay] Error getting country name:', error);
    return countryCode;
  }
}

/**
 * Get subdivision name by alpha2 code
 */
export function getSubdivisionName(subdivisionCode: string): string {
  if (!subdivisionCode) return '';
  
  try {
    const allSubdivisions = subdivisions();
    const subdivision = allSubdivisions.find(s => s.alpha2.toUpperCase() === subdivisionCode.toUpperCase());
    return subdivision ? subdivision.name : subdivisionCode;
  } catch (error) {
    console.error('[CheckoutBay] Error getting subdivision name:', error);
    return subdivisionCode;
  }
}

/**
 * Validate if a country code is valid
 */
export function isValidCountryCode(countryCode: string): boolean {
  if (!countryCode || countryCode.length !== 2) return false;
  
  try {
    const allCountries = getAllCountriesFromPackage();
    return allCountries.some(c => c.alpha2.toUpperCase() === countryCode.toUpperCase());
  } catch (error) {
    console.error('[CheckoutBay] Error validating country code:', error);
    return false;
  }
}

/**
 * Validate if a subdivision code is valid for a country
 */
export function isValidSubdivisionCode(subdivisionCode: string, countryCode: string): boolean {
  if (!subdivisionCode || !countryCode) return false;
  
  try {
    const countrySubdivisions = getCountrySubdivisions(countryCode);
    return countrySubdivisions.some(s => s.alpha2.toUpperCase() === subdivisionCode.toUpperCase());
  } catch (error) {
    console.error('[CheckoutBay] Error validating subdivision code:', error);
    return false;
  }
}

/**
 * Get default countries for fallback
 */
function getDefaultCountries(): Country[] {
  return [
    { name: 'United States', alpha2: 'US' },
    { name: 'Canada', alpha2: 'CA' },
    { name: 'United Kingdom', alpha2: 'GB' },
    { name: 'Germany', alpha2: 'DE' },
    { name: 'France', alpha2: 'FR' },
    { name: 'Australia', alpha2: 'AU' },
    { name: 'Japan', alpha2: 'JP' },
    { name: 'Brazil', alpha2: 'BR' },
    { name: 'Mexico', alpha2: 'MX' },
    { name: 'Italy', alpha2: 'IT' },
    { name: 'Spain', alpha2: 'ES' },
    { name: 'Netherlands', alpha2: 'NL' },
    { name: 'Sweden', alpha2: 'SE' },
    { name: 'Norway', alpha2: 'NO' },
    { name: 'Denmark', alpha2: 'DK' }
  ].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Format countries for select dropdown options
 */
export function formatCountryOptions(countries: Country[]): CountryOption[] {
  return countries.map(country => ({
    label: country.name,
    value: country.alpha2,
    key: country.alpha2
  }));
}

/**
 * Format subdivisions for select dropdown options
 */
export function formatSubdivisionOptions(subdivisions: Subdivision[]): CountryOption[] {
  return subdivisions.map(subdivision => ({
    label: subdivision.name,
    value: subdivision.alpha2,
    key: subdivision.alpha2
  }));
}

/**
 * Get countries filtered by shipping availability (new preferred method)
 */
export function getAvailableCountriesForShipping(shippingRates: PublicShippingRate[]): Country[] {
  if (!shippingRates || !Array.isArray(shippingRates)) {
    console.warn('[CheckoutBay] No shipping rates provided, falling back to default countries');
    return getDefaultCountries();
  }
  
  // Extract country codes from shipping rates
  const availableCountryCodes = new Set<string>();
  
  try {
    shippingRates.forEach(rate => {
      if (rate.rates && Array.isArray(rate.rates)) {
        rate.rates.forEach(r => {
          if (r.countries && Array.isArray(r.countries)) {
            r.countries.forEach(countryCode => {
              if (countryCode && typeof countryCode === 'string') {
                availableCountryCodes.add(countryCode.toUpperCase());
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('[CheckoutBay] Error processing shipping rates for countries:', error);
    return getDefaultCountries();
  }
  
  if (availableCountryCodes.size === 0) {
    console.warn('[CheckoutBay] No countries found in shipping rates, using default list');
    return getDefaultCountries();
  }
  
  return filterCountries(availableCountryCodes);
}

/**
 * Check if shipping is available to a specific country
 */
export function isShippingAvailableToCountry(countryCode: string, shippingRates: PublicShippingRate[]): boolean {
  if (!countryCode || !shippingRates || !Array.isArray(shippingRates)) {
    return false;
  }
  
  const upperCountryCode = countryCode.toUpperCase();
  
  try {
    return shippingRates.some(rate => {
      if (!rate.rates || !Array.isArray(rate.rates)) return false;
      
      return rate.rates.some(r => {
        if (!r.countries || !Array.isArray(r.countries)) return false;
        
        return r.countries.some(c => 
          c && typeof c === 'string' && c.toUpperCase() === upperCountryCode
        );
      });
    });
  } catch (error) {
    console.error('[CheckoutBay] Error checking shipping availability:', error);
    return false;
  }
}

// Legacy support - export countries list for backward compatibility
export const countries = getAllCountries();