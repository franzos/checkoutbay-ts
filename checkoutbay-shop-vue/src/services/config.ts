import { CheckoutbayApi } from '@gofranz/checkoutbay-common'
import { API_BASE_URL, SHOP_ID } from '../constants'

function isUUID(urlShopId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(urlShopId);
}

export const getShopId = () => {
  // First try URL parameter
  const hashQuery = window.location.hash.split('?')[1] || ''
  const params = new URLSearchParams(hashQuery)
  const shopId = params.get('shop_id')

  if (shopId && isUUID(shopId)) {
    console.debug('Using shop ID from URL:', shopId)
    localStorage.setItem('shop_id', shopId)
    localStorage.removeItem('selectedWarehouse')
    return shopId
  }

  try {
    const stored = localStorage.getItem('shop_id')
    if (stored && isUUID(stored)) {
      console.debug('Using shop ID from localStorage:', stored)
      return stored
    }
  } catch (error) {
    console.warn('[frontend] Failed to load shop ID from localStorage:', error)
  }

  return SHOP_ID
}

const baseUrl = API_BASE_URL || 'https://api.checkoutbay.com/v1'
console.log('Using API base URL:', baseUrl)

export const api = new CheckoutbayApi({
  baseUrl,
  timeout: 10000
})
