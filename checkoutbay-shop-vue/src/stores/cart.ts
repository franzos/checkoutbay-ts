import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '../services/config'
import { getShopId } from '../services/config'
import type { CartItem, ProcessedOrder, PublicProduct } from '../types'
import { useShippingStore } from './shipping'
import { Currency } from '@gofranz/common'
import { withRetry } from '../utils/retry'

export const useCartStore = defineStore('cart', () => {
  const shippingStore = useShippingStore()

  // State
  const items = ref<CartItem[]>(JSON.parse(localStorage.getItem('cartItems') || '[]'))
  const calculatedOrder = ref<ProcessedOrder | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addItem = async (productId: string, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ productId, quantity })
    }
    
    localStorage.setItem('cartItems', JSON.stringify(items.value))
    await calculateOrder()
  }

  const removeItem = async (productId: string) => {
    items.value = items.value.filter(item => item.productId !== productId)
    localStorage.setItem('cartItems', JSON.stringify(items.value))
    await calculateOrder()
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      item.quantity = quantity
      localStorage.setItem('cartItems', JSON.stringify(items.value))
      await calculateOrder()
    }
  }

  const loadProducts = async () => {
    if (items.value.length === 0) return

    const shopId = getShopId()
    const productIds = items.value.map(item => item.productId)
    
    try {
      const response = await withRetry(() => 
        api.getPublicProductsComplete(shopId, undefined, undefined, shippingStore.selectedWarehouse || undefined)
      )
      
      // Update items with product details
      items.value = items.value.map((item: CartItem) => {
        const product = response.data.find((p: PublicProduct) => p.id === item.productId)
        return { ...item, product }
      })
    } catch (e) {
      console.error('Failed to load products:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        error.value = 'Unable to connect to server. Please check your internet connection and try again.'
      } else if (errorMessage.includes('404')) {
        error.value = 'Some products in your cart are no longer available.'
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        error.value = 'You are not authorized to view these products.'
      } else {
        error.value = `Failed to load product details: ${errorMessage}`
      }
      throw new Error(error.value)
    }
  }

  const calculateOrder = async () => {
    if (items.value.length === 0) {
      calculatedOrder.value = null
      return
    }

    if (!shippingStore.selectedCountry) {
      error.value = 'No shipping country selected'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const shopId = getShopId()
      calculatedOrder.value = await withRetry(() => 
        api.calculateOrder({
          id: crypto.randomUUID(),
          shop_id: shopId,
          warehouse_id: shippingStore.selectedWarehouse || undefined,
          currency: Currency.USD,
          destination_country: shippingStore.selectedCountry,
          ignore_threshold: false,
          items: items.value.map(item => ({
            product_id: item.productId,
            quantity: item.quantity
          }))
        })
      )
    } catch (e) {
      console.error('Failed to calculate order:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        error.value = 'Unable to connect to server. Please check your internet connection and try again.'
      } else if (errorMessage.includes('400')) {
        error.value = 'Invalid cart items. Please remove invalid items and try again.'
      } else if (errorMessage.includes('404')) {
        error.value = 'Some products in your cart are no longer available.'
      } else if (errorMessage.includes('insufficient')) {
        error.value = 'Not enough items in stock for your cart.'
      } else {
        error.value = `Unable to calculate order total: ${errorMessage}`
      }
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  const clear = () => {
    items.value = []
    calculatedOrder.value = null
    localStorage.removeItem('cartItems')
  }

  // Watch for shipping country changes and recalculate order
  watch(() => shippingStore.selectedCountry, async (newCountry) => {
    if (newCountry && items.value.length > 0) {
      try {
        await calculateOrder()
      } catch (e) {
        console.error('Failed to recalculate order after country change:', e)
      }
    }
  })

  return {
    // State
    items,
    calculatedOrder,
    isLoading,
    error,
    // Getters
    totalItems,
    isEmpty,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    loadProducts,
    calculateOrder,
    clear
  }
})
