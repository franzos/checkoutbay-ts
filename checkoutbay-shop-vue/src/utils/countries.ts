import { countries, type Country } from 'rust_iso3166-ts'

// Export a function to get available countries based on country codes
export function filterCountries(countryCodes: Set<string>): Country[] {
  try {
    const allCountries = countries()
    return allCountries.filter(country => countryCodes.has(country.alpha2.toUpperCase())).sort((a, b) => a.alpha2.localeCompare(b.alpha2))
  } catch (error) {
    console.error('Error filtering countries:', error)
    return []
  }
}
