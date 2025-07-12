<template>
  <n-layout>
    <div class="container">
      <div class="content-wrapper">
        <n-spin :show="isLoading">
          <!-- Error State -->
          <template v-if="error">
            <div class="payment-result-container payment-result-error">
              <!-- Header -->
              <div class="payment-result-header">
                <div class="payment-result-icon">✗</div>
                <h1 class="payment-result-title">Order Error</h1>
                <n-button
                  quaternary
                  circle
                  size="small"
                  class="payment-result-close"
                  @click="goToProducts"
                >
                  ×
                </n-button>
              </div>

              <!-- Content -->
              <div class="payment-result-content">
                <div class="payment-result-message">
                  {{ error }}
                </div>

                <!-- Actions -->
                <div class="payment-result-actions">
                  <n-button
                    type="primary"
                    size="large"
                    @click="goToProducts"
                  >
                    Return to Shop
                  </n-button>
                  <n-button
                    quaternary
                    size="large"
                    @click="contactSupport"
                  >
                    Contact Support
                  </n-button>
                </div>
              </div>
            </div>
          </template>

          <!-- Success State -->
          <template v-else-if="orderStatus">
            <div class="payment-result-container payment-result-success">
              <!-- Header -->
              <div class="payment-result-header">
                <div class="payment-result-icon">✓</div>
                <h1 class="payment-result-title">Order Confirmed!</h1>
                <n-button
                  quaternary
                  circle
                  size="small"
                  class="payment-result-close"
                  @click="goToProducts"
                >
                  ×
                </n-button>
              </div>

              <!-- Content -->
              <div class="payment-result-content">
                <div class="payment-result-message">
                  Thank you! Your payment has been processed successfully and your order is confirmed.
                </div>

                <!-- Order Details -->
                <div class="payment-result-details">
                  <h3 class="payment-result-details-title">Order Details</h3>
                  
                  <div class="payment-result-detail-row">
                    <span class="payment-result-detail-label">Order Number:</span>
                    <span class="payment-result-detail-value">{{ orderId }}</span>
                  </div>
                  
                  <div class="payment-result-detail-row">
                    <span class="payment-result-detail-label">Total Amount:</span>
                    <span class="payment-result-detail-value">
                      {{ formatPrice(orderStatus.total, shopStore.shop?.default_currency) }}
                    </span>
                  </div>
                  
                  <div class="payment-result-detail-row">
                    <span class="payment-result-detail-label">Status:</span>
                    <span class="payment-result-detail-value status-success">
                      Payment Successful
                    </span>
                  </div>
                  
                  <div class="payment-result-detail-row">
                    <span class="payment-result-detail-label">Date:</span>
                    <span class="payment-result-detail-value">
                      {{ formatDate(new Date().toISOString()) }}
                    </span>
                  </div>
                </div>

                <!-- What's Next Info -->
                <div class="payment-result-next-steps">
                  <h4>What's Next?</h4>
                  <ul>
                    <li>A confirmation email has been sent to your email address</li>
                    <li>Your order is being processed and will be shipped soon</li>
                    <li>You'll receive tracking information once your order ships</li>
                  </ul>
                </div>

                <!-- Actions -->
                <div class="payment-result-actions">
                  <n-button
                    quaternary
                    size="large"
                    @click="goToProducts"
                  >
                    Continue Shopping
                  </n-button>
                  <n-button
                    type="primary"
                    size="large"
                    @click="printOrder"
                  >
                    Print Receipt
                  </n-button>
                </div>

                <!-- Copy Order ID -->
                <n-button
                  quaternary
                  block
                  class="copy-order-id"
                  @click="copyOrderId"
                >
                  📋 {{ copyButtonText }}
                </n-button>
              </div>
            </div>
          </template>
        </n-spin>
      </div>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NLayout,
  NSpin,
  NButton,
  useMessage
} from 'naive-ui'
import { api } from '../services/config'
import type { ProcessedOrderPreview } from '../types'
import { OrderStatus, formatPrice } from '@gofranz/checkoutbay-common'
import { useShopStore } from '../stores/shop'
import { useCartStore } from '../stores/cart'
import { useCheckoutStore } from '../stores/checkout'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const shopStore = useShopStore()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const orderStatus = ref<ProcessedOrderPreview | null>(null)
const orderId = ref<string | null>(null)
const copyButtonText = ref('Copy Order ID')

onMounted(async () => {
  try {
    // Extract parameters from URL query
    const purchaseStatus = route.query.purchase as string
    const orderIdParam = route.query.order as string
    
    if (!orderIdParam) {
      throw new Error('No order ID provided')
    }

    if (purchaseStatus !== 'success') {
      throw new Error('Payment was not successful')
    }

    orderId.value = orderIdParam
    
    // Fetch order details
    orderStatus.value = await api.orderStatus(orderIdParam)

    // Verify order status is valid
    if (orderStatus.value.status !== OrderStatus.NEW && 
        orderStatus.value.status !== OrderStatus.PAID && 
        orderStatus.value.status !== OrderStatus.PROCESSING) {
      throw new Error('Order status is invalid')
    }

    // Clear cart and checkout data only after successful payment confirmation
    cartStore.clear()
    checkoutStore.clear()
  } catch (e) {
    console.error('Error loading order confirmation:', e)
    error.value = e instanceof Error ? e.message : 'An error occurred loading your order confirmation'
  } finally {
    isLoading.value = false
  }
})

const goToProducts = () => {
  router.push({ name: 'product-selection' })
}

const printOrder = () => {
  window.print()
}

const contactSupport = () => {
  message.info('Please contact support for assistance with your order.')
}

const copyOrderId = async () => {
  if (!orderId.value) return
  
  try {
    await navigator.clipboard.writeText(orderId.value)
    copyButtonText.value = '✓ Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy Order ID'
    }, 2000)
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = orderId.value
      document.body.appendChild(textArea)
      textArea.select()
      // @ts-ignore - using legacy API for fallback support
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      copyButtonText.value = '✓ Copied!'
      setTimeout(() => {
        copyButtonText.value = 'Copy Order ID'
      }, 2000)
    } catch (fallbackErr) {
      console.warn('Could not copy to clipboard:', fallbackErr)
      message.warning('Copy to clipboard not supported in this browser')
    }
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 500px;
}

/* Payment Result Container */
.payment-result-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Header */
.payment-result-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.payment-result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
}

.payment-result-success .payment-result-icon {
  background: #10b981;
  color: white;
}

.payment-result-error .payment-result-icon {
  background: #ef4444;
  color: white;
}

.payment-result-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.payment-result-success .payment-result-title {
  color: #10b981;
}

.payment-result-error .payment-result-title {
  color: #ef4444;
}

.payment-result-close {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* Content */
.payment-result-content {
  padding: 24px;
}

.payment-result-message {
  font-size: 16px;
  color: #374151;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* Details Section */
.payment-result-details {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.payment-result-details-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #374151;
}

.payment-result-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.payment-result-detail-row:last-child {
  margin-bottom: 0;
}

.payment-result-detail-label {
  font-weight: 500;
  color: #6b7280;
}

.payment-result-detail-value {
  font-weight: 600;
  color: #374151;
}

.status-success {
  color: #10b981;
}

/* What's Next Section */
.payment-result-next-steps {
  background: #eff6ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.payment-result-next-steps h4 {
  margin: 0 0 8px 0;
  color: #1e40af;
  font-size: 16px;
  font-weight: 600;
}

.payment-result-next-steps ul {
  margin: 0;
  padding-left: 16px;
  color: #1e40af;
}

.payment-result-next-steps li {
  margin-bottom: 4px;
}

/* Actions */
.payment-result-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.payment-result-actions .n-button {
  flex: 1;
  min-width: 120px;
}

.copy-order-id {
  text-align: center;
  margin-top: 8px;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .container {
    padding: 16px;
  }
  
  .payment-result-container {
    margin: 10px;
  }
  
  .payment-result-header {
    padding: 20px 20px 12px 20px;
  }
  
  .payment-result-content {
    padding: 20px;
  }
  
  .payment-result-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-right: 12px;
  }
  
  .payment-result-title {
    font-size: 20px;
  }
  
  .payment-result-actions {
    flex-direction: column;
  }
  
  .payment-result-actions .n-button {
    flex: none;
    width: 100%;
  }
}

@media print {
  .container {
    padding: 0;
    min-height: auto;
  }
  
  .payment-result-close,
  .payment-result-actions,
  .copy-order-id {
    display: none;
  }
  
  .payment-result-container {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>