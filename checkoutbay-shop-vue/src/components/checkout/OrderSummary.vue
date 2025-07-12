<template>
  <n-card title="Order Summary">
    <n-spin :show="cartStore.isLoading">
      <n-alert
        v-if="cartStore.error"
        type="error"
        :title="cartStore.error"
      />

      <template v-else>
        <!-- Cart Items -->
        <n-list bordered>
          <n-list-item v-for="item in cartStore.items" :key="item.productId">
            <n-space justify="space-between" align="start">
              <div>
                <n-text strong>{{ item.product?.title }}</n-text>
                <div>
                  <n-text depth="3">Qty: {{ item.quantity }}</n-text>
                  <template v-if="cartStore.calculatedOrder">
                    <div>
                      <n-text depth="3">
                        Unit Tax: {{ formatPrice(findItemTax(item.productId)?.unit_tax, shopStore.shop?.default_currency) }}
                      </n-text>
                    </div>
                    <div>
                      <n-text depth="3">
                        Total Tax: {{ formatPrice(findItemTax(item.productId)?.tax_total, shopStore.shop?.default_currency) }}
                      </n-text>
                    </div>
                  </template>
                </div>
              </div>
              <n-text strong>
                {{ formatPrice(calculateItemTotal(item), shopStore.shop?.default_currency) }}
              </n-text>
            </n-space>
          </n-list-item>
        </n-list>

        <!-- Order Totals -->
        <template v-if="cartStore.calculatedOrder">
          <n-divider />
          <n-space vertical size="small">
            <n-space justify="space-between">
              <n-text>Subtotal</n-text>
              <n-text>{{ formatPrice(cartStore.calculatedOrder.subtotal, shopStore.shop?.default_currency) }}</n-text>
            </n-space>
            <n-space justify="space-between">
              <n-text>Shipping</n-text>
              <n-text>{{ formatPrice(cartStore.calculatedOrder.shipping_total, shopStore.shop?.default_currency) }}</n-text>
            </n-space>
            <n-space justify="space-between">
              <n-text>Tax</n-text>
              <n-text>{{ formatPrice(cartStore.calculatedOrder.tax_total, shopStore.shop?.default_currency) }}</n-text>
            </n-space>
            <n-divider />
            <n-space justify="space-between">
              <n-text strong>Total</n-text>
              <n-text strong>{{ formatPrice(cartStore.calculatedOrder.total, shopStore.shop?.default_currency) }}</n-text>
            </n-space>
          </n-space>
        </template>

        <!-- Actions -->
        <n-space justify="end" style="margin-top: 16px">
          <slot name="actions"></slot>
        </n-space>
      </template>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { 
  NCard,
  NSpin,
  NAlert,
  NList,
  NListItem,
  NSpace,
  NText,
  NDivider
} from 'naive-ui'
import { useCartStore } from '../../stores/cart'
import { useShopStore } from '../../stores/shop'
import type { Decimal } from 'decimal.js'
import type { CartItem } from '../../types'
import { formatPrice } from '@gofranz/checkoutbay-common'

const cartStore = useCartStore()
const shopStore = useShopStore()

const findItemTax = (productId: string) => {
  return cartStore.calculatedOrder?.items.find(item => item.product_id === productId)
}

const calculateItemTotal = (item: CartItem) => {
  if (!item.product?.price) return 0
  return Number(item.product.price) * item.quantity
}
</script>
