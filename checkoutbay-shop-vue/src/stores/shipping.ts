import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/config'
import { getShopId } from '../services/config'
import type { Subdivision, PublicShippingRate } from '../types'
import { subdivisions, type Country } from 'rust_iso3166-ts'
import { filterCountries } from '../utils/countries'
import { withRetry } from '../utils/retry'

export const useShippingStore = defineStore('shipping', () => {
  // State
  const selectedCountry = ref<string | null>(localStorage.getItem('selectedCountry'))
  const selectedWarehouse = ref<string | null>(localStorage.getItem('selectedWarehouse'))
  const availableRates = ref<PublicShippingRate[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const availableCountries = computed(() => {
    if (!availableRates.value || !Array.isArray(availableRates.value)) {
      console.log('No available rates')
      return []
    }

    // First collect all country codes from rates
    const countrySet = new Set<string>()
    availableRates.value.forEach((rate: PublicShippingRate) => {
      rate.rates && rate.rates.forEach((r: { countries: string[] }) => {
        r.countries && r.countries.forEach((c: string) => countrySet.add(c))
      })
    })

    console.log('Collected country codes:', Array.from(countrySet))
    return filterCountries(countrySet)
  })

  const countrySubdivisions = computed(() => {
    if (!selectedCountry.value) return []
    return subdivisions().filter((s: Subdivision) => s.country === selectedCountry.value)
  })

  const availableWarehouses = computed(() => {
    if (!selectedCountry.value || !availableRates.value || !Array.isArray(availableRates.value)) {
      return []
    }
    return availableRates.value.filter((rate: PublicShippingRate) =>
      rate.rates && Array.isArray(rate.rates) &&
      rate.rates.some((r: { countries: string[] }) => 
        r.countries && Array.isArray(r.countries) && 
        r.countries.includes(selectedCountry.value!)
      )
    )
  })

  // Actions
  const fetchShippingRates = async () => {
    isLoading.value = true
    error.value = null
    availableRates.value = [] // Reset rates before fetching
    try {
      const shopId = getShopId()
      const rates = await withRetry(() => api.getPublicShippingRates(shopId))
      console.log(rates)
      console.log(`Fetched ${rates.length} shipping rates`)
      availableRates.value = rates
    } catch (e) {
      console.error('Failed to fetch shipping rates:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        error.value = 'Unable to connect to server. Please check your internet connection and try again.'
      } else if (errorMessage.includes('404')) {
        error.value = 'No shipping rates configured for this shop. Please contact support.'
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        error.value = 'You are not authorized to view shipping information.'
      } else {
        error.value = `Unable to load shipping options: ${errorMessage}`
      }
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  const setCountry = (country: string) => {
    console.log('Setting country:', country)
    selectedCountry.value = country
    localStorage.setItem('selectedCountry', country)
    
    // Reset warehouse if current selection is not available for new country
    if (selectedWarehouse.value) {
      const isWarehouseAvailable = availableWarehouses.value
        .some((w: PublicShippingRate) => w.warehouse_id === selectedWarehouse.value)
      
      if (!isWarehouseAvailable) {
        selectedWarehouse.value = null
        localStorage.removeItem('selectedWarehouse')
      }
    }
  }

  const setWarehouse = (warehouseId: string) => {
    console.log('Setting warehouse:', warehouseId)
    selectedWarehouse.value = warehouseId
    localStorage.setItem('selectedWarehouse', warehouseId)
  }

  const reset = () => {
    selectedCountry.value = null
    selectedWarehouse.value = null
    localStorage.removeItem('selectedCountry')
    localStorage.removeItem('selectedWarehouse')
  }

  return {
    // State
    selectedCountry,
    selectedWarehouse,
    availableRates,
    isLoading,
    error,
    // Getters
    availableCountries,
    countrySubdivisions,
    availableWarehouses,
    // Actions
    fetchShippingRates,
    setCountry,
    setWarehouse,
    reset
  }
})
