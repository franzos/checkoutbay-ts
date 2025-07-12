<template>
  <n-layout>
    <div class="container">
      <div class="content-wrapper">
        <n-spin :show="isLoading">
          <div class="payment-result-container" :class="resultTypeClass">
            <!-- Header -->
            <div class="payment-result-header">
              <div class="payment-result-icon">{{ statusIcon }}</div>
              <h1 class="payment-result-title">{{ pageTitle }}</h1>
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
                {{ errorMessage }}
              </div>

              <!-- Order Details (if order ID exists) -->
              <div v-if="orderId" class="payment-result-details">
                <h3 class="payment-result-details-title">Order Information</h3>
                
                <div class="payment-result-detail-row">
                  <span class="payment-result-detail-label">Order Number:</span>
                  <span class="payment-result-detail-value">{{ orderId }}</span>
                </div>
                
                <div class="payment-result-detail-row">
                  <span class="payment-result-detail-label">Status:</span>
                  <span class="payment-result-detail-value" :class="statusClass">
                    {{ statusText }}
                  </span>
                </div>
                
                <div class="payment-result-detail-row">
                  <span class="payment-result-detail-label">Date:</span>
                  <span class="payment-result-detail-value">
                    {{ formatDate(new Date().toISOString()) }}
                  </span>
                </div>
              </div>

              <!-- What Happened Info -->
              <div class="payment-result-next-steps" :class="infoSectionClass">
                <h4>{{ infoTitle }}</h4>
                <ul>
                  <li v-for="point in infoPoints" :key="point">{{ point }}</li>
                </ul>
              </div>

              <!-- Actions -->
              <div class="payment-result-actions">
                <n-button
                  type="primary"
                  size="large"
                  @click="returnToCart"
                >
                  {{ primaryActionText }}
                </n-button>
                <n-button
                  quaternary
                  size="large"
                  @click="goToProducts"
                >
                  Continue Shopping
                </n-button>
                <n-button
                  v-if="!paymentCancelled"
                  quaternary
                  size="large"
                  @click="contactSupport"
                >
                  Contact Support
                </n-button>
              </div>

              <!-- Copy Order ID (if order ID exists) -->
              <n-button
                v-if="orderId"
                quaternary
                block
                class="copy-order-id"
                @click="copyOrderId"
              >
                📋 {{ copyButtonText }}
              </n-button>
            </div>
          </div>
        </n-spin>
      </div>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NLayout,
  NSpin,
  NButton,
  useMessage
} from 'naive-ui'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const isLoading = ref(false)
const errorMessage = ref<string>('Your payment could not be processed at this time.')
const orderId = ref<string | null>(null)
const paymentCancelled = ref(false)
const copyButtonText = ref('Copy Order ID')

onMounted(async () => {
  try {
    // Extract parameters from URL query
    const purchaseStatus = route.query.purchase as string
    const orderIdParam = route.query.order as string
    
    orderId.value = orderIdParam
    
    // Determine the type of error based on URL parameters
    if (purchaseStatus === 'cancelled') {
      paymentCancelled.value = true
      errorMessage.value = 'Your payment was cancelled. You can try again or choose a different payment method.'
    } else if (purchaseStatus === 'failed') {
      errorMessage.value = 'Your payment was declined. Please check your payment information and try again.'
    } else {
      // Generic error message for other cases
      errorMessage.value = 'There was an issue processing your payment. Please try again.'
    }
  } catch (e) {
    console.error('Error loading payment error page:', e)
    errorMessage.value = 'An unexpected error occurred. Please try again.'
  }
})

// Computed properties for dynamic content
const resultTypeClass = computed(() => {
  return paymentCancelled.value ? 'payment-result-cancelled' : 'payment-result-error'
})

const statusIcon = computed(() => {
  return paymentCancelled.value ? '⚠' : '✗'
})

const pageTitle = computed(() => {
  return paymentCancelled.value ? 'Payment Cancelled' : 'Payment Failed'
})

const statusText = computed(() => {
  return paymentCancelled.value ? 'Payment Cancelled' : 'Payment Failed'
})

const statusClass = computed(() => {
  return paymentCancelled.value ? 'status-cancelled' : 'status-error'
})

const infoTitle = computed(() => {
  return paymentCancelled.value ? 'What happened?' : 'What went wrong?'
})

const infoSectionClass = computed(() => {
  return paymentCancelled.value ? 'payment-result-warning-info' : 'payment-result-error-info'
})

const infoPoints = computed(() => {
  if (paymentCancelled.value) {
    return [
      'Your payment was cancelled or declined',
      'No charges were made to your payment method',
      'Your cart items are still saved'
    ]
  } else {
    return [
      'There was an issue processing your payment',
      'Please check your payment method and try again',
      'If the problem persists, contact support'
    ]
  }
})

const primaryActionText = computed(() => {
  return paymentCancelled.value ? 'Return to Cart' : 'Try Again'
})

const returnToCart = () => {
  router.push({ name: 'cart-checkout' })
}

const goToProducts = () => {
  router.push({ name: 'product-selection' })
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

.payment-result-error .payment-result-icon {
  background: #ef4444;
  color: white;
}

.payment-result-cancelled .payment-result-icon {
  background: #f59e0b;
  color: white;
}

.payment-result-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.payment-result-error .payment-result-title {
  color: #ef4444;
}

.payment-result-cancelled .payment-result-title {
  color: #f59e0b;
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

.status-error {
  color: #ef4444;
}

.status-cancelled {
  color: #f59e0b;
}

/* Info Sections */
.payment-result-next-steps {
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.payment-result-error-info {
  background: #fef2f2;
}

.payment-result-warning-info {
  background: #fffbeb;
}

.payment-result-next-steps h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.payment-result-error-info h4 {
  color: #dc2626;
}

.payment-result-warning-info h4 {
  color: #d97706;
}

.payment-result-next-steps ul {
  margin: 0;
  padding-left: 16px;
}

.payment-result-error-info ul {
  color: #dc2626;
}

.payment-result-warning-info ul {
  color: #d97706;
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