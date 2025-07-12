<template>
  <n-badge 
    :value="cartStore.totalItems" 
    :show="cartStore.totalItems > 0"
    :max="99"
    processing
  >
    <n-button
      circle
      type="primary"
      @click="router.push({ name: 'cart-checkout' })"
    >
      <template #icon>
        <n-icon size="24">
          <shopping-cart />
        </n-icon>
      </template>
    </n-button>
  </n-badge>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NBadge, NButton, NIcon } from 'naive-ui'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '../../stores/cart'

const router = useRouter()
const cartStore = useCartStore()
</script>
