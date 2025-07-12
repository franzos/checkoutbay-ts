<template>
  <n-layout>
    <div class="container">
      <!-- Empty Cart State -->
      <template v-if="cartStore.isEmpty">
        <n-empty
          description="Your Cart is Empty"
          style="margin: 48px 0"
        >
          <template #extra>
            <n-text depth="3" style="margin-bottom: 16px; display: block">
              Looks like you haven't added any items to your cart yet.
            </n-text>
            <n-button
              type="primary"
              @click="router.push({ name: 'product-selection' })"
            >
              Continue Shopping
            </n-button>
          </template>
        </n-empty>
      </template>

      <!-- Cart and Checkout -->
      <template v-else>
        <n-page-header>
          <template #title>
            <n-text>Cart & Checkout</n-text>
          </template>
          <template #extra>
            <n-button
              text
              type="primary"
              class="continue-shopping-btn"
              @click="router.push({ name: 'product-selection' })"
            >
              Continue Shopping
            </n-button>
          </template>
        </n-page-header>

        <n-space vertical size="large">
          <!-- Cart Items -->
          <n-card title="Cart Items">
            <n-list>
              <n-list-item v-for="item in cartStore.items" :key="item.productId">
                <n-space justify="space-between" align="center">
                  <n-space>
                    <div class="product-image-container">
                      <n-image
                        v-if="item.product?.cover_url"
                        :src="item.product.cover_url"
                        :alt="item.product?.title"
                        class="product-image"
                        preview-disabled
                      />
                    </div>
                    <div>
                      <n-text strong>{{ item.product?.title }}</n-text>
                      <div>
                        <n-text depth="3">{{ formatPrice(item.product?.price, shopStore.shop?.default_currency) }} each</n-text>
                      </div>
                    </div>
                  </n-space>
                  <n-space>
                    <n-input-number
                      v-model:value="item.quantity"
                      :min="1"
                      size="small"
                      @update:value="(val) => updateQuantity(item.productId, val || 1)"
                    />
                    <n-button
                      circle
                      text
                      @click="removeItem(item.productId)"
                    >
                      <template #icon>
                        <n-icon><x /></n-icon>
                      </template>
                    </n-button>
                  </n-space>
                </n-space>
              </n-list-item>
            </n-list>
          </n-card>

          <!-- Email -->
          <n-card title="Contact Information">
            <n-form :model="{ email: checkoutStore.email }" :rules="{ email: emailValidationRule }">
              <n-form-item label="Email" path="email">
                <n-input
                  v-model:value="checkoutStore.email"
                  text="email"
                  placeholder="your@email.com"
                />
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Shipping Address -->
          <n-card title="Shipping Address">
            <AddressForm v-model="checkoutStore.shippingAddress" />
          </n-card>

          <!-- Billing Address -->
          <n-card title="Billing Address">
            <n-space vertical>
              <n-space justify="space-between" align="center">
                <n-text>Same as shipping</n-text>
                <n-switch
                  :value="!checkoutStore.useSeparateBillingAddress"
                  @update:value="(val) => toggleBillingAddress({ target: { checked: val } })"
                />
              </n-space>
              <AddressForm
                v-if="checkoutStore.useSeparateBillingAddress"
                v-model="checkoutStore.billingAddress"
              />
            </n-space>
          </n-card>

          <!-- Order Summary -->
          <div :class="{ 'sticky-summary': isDesktop }">
            <OrderSummary>
              <template #actions>
                <n-button
                  type="primary"
                  block
                  :loading="checkoutStore.isLoading"
                  :disabled="!canProceed || checkoutStore.isLoading"
                  @click="submitOrder"
                >
                  Place Order
                </n-button>
              </template>
            </OrderSummary>

            <n-alert
              v-if="checkoutStore.error"
              type="error"
              style="margin-top: 16px"
            >
              {{ checkoutStore.error }}
            </n-alert>
          </div>
        </n-space>
      </template>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  NLayout,
  NEmpty,
  NText,
  NButton,
  NPageHeader,
  NSpace,
  NCard,
  NList,
  NListItem,
  NImage,
  NInputNumber,
  NIcon,
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NAlert
} from 'naive-ui'
import { X } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useCheckoutStore } from '../stores/checkout'
import { useShopStore } from '../stores/shop'
import { useShippingStore } from '../stores/shipping'
import AddressForm from '../components/checkout/AddressForm.vue'
import OrderSummary from '../components/checkout/OrderSummary.vue'
import { formatPrice } from '@gofranz/checkoutbay-common'
import { createEmailValidationRule, isValidEmail } from '../utils/validation'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const shopStore = useShopStore()
const shippingStore = useShippingStore()

// Email validation rule
const emailValidationRule = createEmailValidationRule()

const isDesktop = ref(window.innerWidth >= 1000)

const updateIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 1000
}

onMounted(() => {
  window.addEventListener('resize', updateIsDesktop)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsDesktop)
})

const canProceed = computed(() => {
  if (cartStore.isEmpty) return false
  if (!checkoutStore.email) return false
  // Check if email is valid
  if (!isValidEmail(checkoutStore.email)) return false
  if (!checkoutStore.shippingAddress) return false
  if (checkoutStore.useSeparateBillingAddress && !checkoutStore.billingAddress) return false
  return true
})

const updateQuantity = async (productId: string, quantity: number) => {
  if (quantity < 1) return
  await cartStore.updateQuantity(productId, quantity)
}

const removeItem = async (productId: string) => {
  await cartStore.removeItem(productId)
}

const toggleBillingAddress = (event: { target: { checked: boolean } }) => {
  if (event.target.checked) {
    checkoutStore.setBillingAddress(null)
  } else {
    checkoutStore.setBillingAddress({ ...checkoutStore.shippingAddress! })
  }
}

const submitOrder = async () => {
  try {
    const payment = await checkoutStore.submitOrder()
    if (payment.data?.redirect_url) {
      // Redirect to Stripe checkout
      window.location.href = payment.data.redirect_url
    } else {
      // Handle case where no redirect URL is provided
      const errorMsg = 'Payment processing failed: No redirect URL received'
      console.error(errorMsg, payment)
      checkoutStore.error = errorMsg
    }
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to submit order'
    console.error('Order submission failed:', e)
    checkoutStore.error = errorMsg
  }
}

onMounted(async () => {
  if (!cartStore.isEmpty) {
    // Initialize shipping store first to ensure country/warehouse info is available for tax calculation
    if (!shippingStore.availableRates.length) {
      try {
        await shippingStore.fetchShippingRates()
      } catch (e) {
        console.error('Failed to fetch shipping rates on cart page:', e)
      }
    }
    
    // Load products first
    await cartStore.loadProducts()
    
    // Then calculate order to get tax information if shipping country is available
    if (shippingStore.selectedCountry) {
      await cartStore.calculateOrder()
    }
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

.sticky-summary {
  position: sticky;
  top: 16px;
}

.product-image-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 1000px) {
  .n-space {
    display: grid !important;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .n-space > :last-child {
    grid-column: 2;
    grid-row: 1 / span 4;
  }
}

@media (max-width: 767px) {
  /* .continue-shopping-btn {
    display: none;
  } */
  
  .container {
    padding: 16px;
  }
}
</style>
