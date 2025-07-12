<template>
  <n-layout>
    <div class="container">
      <n-page-header>
        <template #title>
          <n-text>Products</n-text>
        </template>
        <template #extra>
          <n-space align="center">
            <n-tag type="primary" size="large">
              {{ shippingStore.selectedCountry }}
            </n-tag>
            <n-button
              text
              type="primary"
              @click="changeCountry"
            >
              Change
            </n-button>
          </n-space>
        </template>
      </n-page-header>

      <n-spin :show="isLoading">
        <template v-if="error">
          <div style="margin: 24px 0">
            <n-alert
              type="error"
              :title="error"
            />
            <n-space justify="end" style="margin-top: 12px">
              <n-button
                size="small"
                @click="loadProducts"
              >
                Retry
              </n-button>
            </n-space>
          </div>
        </template>

        <template v-else-if="!products.length">
          <n-empty
            description="No Products Available"
            style="margin: 48px 0"
          >
            <template #extra>
              <n-text depth="3" style="margin-bottom: 16px; display: block">
                There are no products available for your selected country at this time.
              </n-text>
              <n-button
                type="primary"
                @click="changeCountry"
              >
                Select Different Country
              </n-button>
            </template>
          </n-empty>
        </template>

        <template v-else>
          <n-grid
            :x-gap="24"
            :y-gap="24"
            cols="1 s:2 m:3"
            responsive="screen"
          >
            <n-gi
              v-for="product in products"
              :key="product.id"
            >
              <ProductCard :product="product" />
            </n-gi>
          </n-grid>

          <n-space justify="center" style="margin-top: 32px">
            <n-pagination
              v-if="totalPages > 1"
              v-model:page="currentPage"
              :page-count="totalPages"
              :on-update:page="changePage"
            />
          </n-space>
        </template>
      </n-spin>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NLayout,
  NPageHeader,
  NSpace,
  NTag,
  NButton,
  NSpin,
  NAlert,
  NEmpty,
  NText,
  NGrid,
  NGi,
  NPagination
} from 'naive-ui'
import { useShippingStore } from '../stores/shipping'
import CartIcon from '../components/common/CartIcon.vue'
import ProductCard from '../components/product/ProductCard.vue'
import { api, getShopId } from '../services/config'
import type { PublicProduct } from '../types'

const router = useRouter()
const shippingStore = useShippingStore()

const isLoading = ref(true)
const error = ref<string | null>(null)
const products = ref<PublicProduct[]>([])
const currentPage = ref(1)
const itemsPerPage = 12
const totalItems = ref(0)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const changeCountry = () => {
  shippingStore.reset()
  router.push({ name: 'country-selection' })
}

const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await loadProducts()
}

const loadProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const offset = (currentPage.value - 1) * itemsPerPage
    const response = await api.getPublicProducts(
      getShopId(),
      true, // is_live
      itemsPerPage,
      offset,
      shippingStore.selectedWarehouse || undefined
    )
    
    products.value = response.data || []
    console.log('Loaded products:', products.value) // Debug log
    totalItems.value = response.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load products'
    console.error('Failed to load products:', e)
  } finally {
    isLoading.value = false
  }
}

// Watch for shipping store changes
watch(() => shippingStore.selectedWarehouse, async (newWarehouse) => {
  if (newWarehouse) {
    await loadProducts()
  }
})

onMounted(async () => {
  // Ensure we have shipping rates loaded
  if (!shippingStore.availableRates.length) {
    await shippingStore.fetchShippingRates()
  }
  
  // If we have a country but no warehouse selected, and there's only one warehouse,
  // auto-select it
  if (shippingStore.selectedCountry && !shippingStore.selectedWarehouse && shippingStore.availableWarehouses.length === 1) {
    shippingStore.setWarehouse(shippingStore.availableWarehouses[0].warehouse_id)
  }
  
  await loadProducts()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}
</style>
