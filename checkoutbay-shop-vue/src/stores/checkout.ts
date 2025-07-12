import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/config'
import { getShopId } from '../services/config'
import type { InlineAddress, CartItem } from '../types'
import { useShippingStore } from './shipping'
import { useCartStore } from './cart'
import { Currency } from '@gofranz/common'
import type { OrderPaymentWithParsedData } from '@gofranz/checkoutbay-common'

// Global configuration interface
interface CheckoutBayConfig {
  successUrl?: string;
  cancelUrl?: string;
}

declare global {
  interface Window {
    CheckoutBayConfig?: CheckoutBayConfig;
  }
}

export const useCheckoutStore = defineStore('checkout', () => {
  const shippingStore = useShippingStore()
  const cartStore = useCartStore()

  // State
  const shippingAddress = ref<InlineAddress | null>(
    JSON.parse(localStorage.getItem('shippingAddress') || 'null')
  )
  const billingAddress = ref<InlineAddress | null>(
    JSON.parse(localStorage.getItem('billingAddress') || 'null')
  )
  const email = ref<string>(localStorage.getItem('checkoutEmail') || '')
  const selectedShippingMethod = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const orderId = ref<string | null>(null)
  const paymentUrl = ref<string | null>(null)

  // Getters
  const isComplete = computed(() => 
    !!shippingAddress.value &&
    !!email.value &&
    (shippingStore.availableWarehouses.length === 0 || !!shippingStore.selectedWarehouse)
  )

  const useSeparateBillingAddress = computed(() => !!billingAddress.value)

  // Actions
  const setShippingAddress = (address: InlineAddress) => {
    shippingAddress.value = address
    localStorage.setItem('shippingAddress', JSON.stringify(address))
  }

  const setBillingAddress = (address: InlineAddress | null) => {
    billingAddress.value = address
    if (address) {
      localStorage.setItem('billingAddress', JSON.stringify(address))
    } else {
      localStorage.removeItem('billingAddress')
    }
  }

  const setEmail = (value: string) => {
    email.value = value
    localStorage.setItem('checkoutEmail', value)
  }

  const setShippingMethod = (methodId: string) => {
    selectedShippingMethod.value = methodId
  }

  const submitOrder = async (): Promise<OrderPaymentWithParsedData> => {
    if (!isComplete.value || !shippingAddress.value || cartStore.isEmpty) {
      throw new Error("Cannot submit incomplete order");
    }

    isLoading.value = true;
    error.value = null;

    try {
      const shopId = getShopId();
      const orderData = {
        id: crypto.randomUUID(),
        shop_id: shopId,
        items: cartStore.items.map((item: CartItem) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        customer_user_email: email.value,
        shipping_address: shippingAddress.value,
        billing_address: billingAddress.value || shippingAddress.value,
        warehouse_id: shippingStore.selectedWarehouse || undefined,
        shipping_method: selectedShippingMethod.value || undefined,
        currency: Currency.USD,
      };

      await api.createPublicOrder(orderData);
      orderId.value = orderData.id;

      // Request payment with configurable redirect URLs
      const baseUrl = window.location.origin;

      // Use configured URLs or fallback to Vue app routes
      const successUrl = `${baseUrl}/#/order/thank-you`;
      const cancelUrl = `${baseUrl}/#/order/error`;

      console.log(`Success URL: ${successUrl}`);
      console.log(`Cancel URL: ${cancelUrl}`);

      const payment = await api.createOrderPayment({
        order_id: orderData.id,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      // Parse the payment data similar to common-shop checkoutOrder method
      const result: OrderPaymentWithParsedData = {
        ...payment,
        data: JSON.parse(payment.data as string),
      };

      if (result.data?.redirect_url) {
        paymentUrl.value = result.data.redirect_url;
      }

      // Note: Cart and checkout data will be cleared only after successful payment confirmation
      // This allows users to retry if payment fails

      return result;
    } catch (e) {
      console.error('Failed to submit order:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        error.value = 'Unable to connect to payment server. Please check your internet connection and try again.'
      } else if (errorMessage.includes('400')) {
        error.value = 'Invalid order information. Please check your details and try again.'
      } else if (errorMessage.includes('404')) {
        error.value = 'Some items in your cart are no longer available.'
      } else if (errorMessage.includes('insufficient')) {
        error.value = 'Not enough items in stock to complete your order.'
      } else if (errorMessage.includes('payment')) {
        error.value = 'Payment processing failed. Please try again or use a different payment method.'
      } else if (errorMessage.includes('address')) {
        error.value = 'Please check your shipping and billing addresses for errors.'
      } else {
        error.value = `Order submission failed: ${errorMessage}`
      }
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const clear = () => {
    shippingAddress.value = null
    billingAddress.value = null
    email.value = ''
    selectedShippingMethod.value = null
    orderId.value = null
    paymentUrl.value = null
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('billingAddress')
    localStorage.removeItem('checkoutEmail')
  }

  return {
    // State
    shippingAddress,
    billingAddress,
    email,
    selectedShippingMethod,
    isLoading,
    error,
    orderId,
    paymentUrl,
    // Getters
    isComplete,
    useSeparateBillingAddress,
    // Actions
    setShippingAddress,
    setBillingAddress,
    setEmail,
    setShippingMethod,
    submitOrder,
    clear
  }
})
