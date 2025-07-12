<template>
  <n-card hoverable>
    <template #cover v-if="product.cover_url">
      <n-image
        :src="product.cover_url"
        :alt="product.title"
        object-fit="cover"
        height="200"
        preview-disabled
      />
    </template>
    <n-h3>{{ product.title }}</n-h3>
    <n-text depth="3" class="description">{{ product.description }}</n-text>
    <n-space justify="space-between" align="center" style="margin-top: 16px">
      <n-text strong>{{ formatPrice(product.price, shopStore.shop?.default_currency) }}</n-text>
      <n-input-number
        v-model:value="quantity"
        :min="1"
        size="small"
        style="width: 120px"
      />
    </n-space>
    <n-space justify="end" style="margin-top: 16px">
      <n-button
        type="primary"
        :loading="isLoading"
        :disabled="isLoading"
        @click="addToCart"
      >
        Add to Cart
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  NCard, 
  NImage, 
  NH3, 
  NText, 
  NSpace, 
  NInputNumber, 
  NButton 
} from 'naive-ui'
import type { PublicProduct } from '../../types'
import { useCartStore } from '../../stores/cart'
import { useShopStore } from '../../stores/shop'
import { formatPrice } from '@gofranz/checkoutbay-common'

const props = defineProps<{
  product: PublicProduct
}>()

const cartStore = useCartStore()
const shopStore = useShopStore()
const quantity = ref(1)
const isLoading = ref(false)

const addToCart = async () => {
  isLoading.value = true
  try {
    await cartStore.addItem(props.product.id, quantity.value)
    quantity.value = 1 // Reset quantity after successful add
  } catch (e) {
    console.error('Failed to add item to cart:', e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
