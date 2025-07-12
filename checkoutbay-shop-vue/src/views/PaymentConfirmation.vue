<template>
  <n-layout>
    <div class="container">
      <div class="content-wrapper">
        <n-spin :show="isLoading">
          <template v-if="error">
            <n-result
              status="error"
              title="Payment Error"
              :description="error"
            >
              <template #footer>
                <n-button
                  type="primary"
                  @click="goToProducts"
                >
                  Return to Shop
                </n-button>
              </template>
            </n-result>
          </template>

          <template v-else-if="orderStatus">
            <n-card>
              <n-result
                status="success"
                title="Payment Successful!"
                description="Thank you for your order. Your payment has been processed successfully."
              >
                <template #footer>
                  <n-space vertical>
                    <n-descriptions
                      title="Order Details"
                      :column="1"
                      bordered
                    >
                      <n-descriptions-item label="Order ID">
                        {{ orderId }}
                      </n-descriptions-item>
                      <n-descriptions-item label="Total Amount">
                        {{ formatPrice(orderStatus.total, shopStore.shop?.default_currency) }}
                      </n-descriptions-item>
                      <n-descriptions-item label="Status">
                        {{ orderStatus.status }}
                      </n-descriptions-item>
                    </n-descriptions>

                    <n-alert
                      type="info"
                      title="A confirmation email has been sent to your email address."
                      style="margin: 16px 0"
                    />

                    <n-button
                      type="primary"
                      block
                      @click="goToProducts"
                    >
                      Continue Shopping
                    </n-button>
                  </n-space>
                </template>
              </n-result>
            </n-card>
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
  NResult,
  NButton,
  NCard,
  NSpace,
  NDescriptions,
  NDescriptionsItem,
  NAlert
} from 'naive-ui'
import { api } from '../services/config'
import type { ProcessedOrderPreview } from '../types'
import { OrderStatus, formatPrice } from '@gofranz/checkoutbay-common'
import { useShopStore } from '../stores/shop'

const route = useRoute()
const router = useRouter()
const shopStore = useShopStore()
const isLoading = ref(true)
const error = ref<string | null>(null)
const orderStatus = ref<ProcessedOrderPreview | null>(null)
const orderId = ref<string | null>(null)

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('order')
    const status = params.get('purchase')
    
    if (!id) {
      throw new Error('No order ID provided')
    }

    if (status !== 'success') {
      throw new Error('Payment was not successful')
    }

    orderId.value = id
    orderStatus.value = await api.orderStatus(id)

    if (orderStatus.value.status !== OrderStatus.NEW && orderStatus.value.status !== OrderStatus.PAID) {
      throw new Error('Order status is invalid')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred processing your payment'
  } finally {
    isLoading.value = false
  }
})

const goToProducts = () => {
  router.push({ name: 'product-selection' })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

.content-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
</style>
