<template>
  <div class="container">
    <n-h1>Shipping Details</n-h1>
    <div class="form-container">
      <n-spin :show="shippingStore.isLoading || isLoading">
        <template v-if="shippingStore.error">
          <n-alert
            type="error"
            :title="shippingStore.error"
            style="margin-bottom: 16px"
          />
        </template>

        <n-card v-else title="Shipping Information">
          <n-form>
            <n-form-item 
              label="Shipping Country"
              :feedback="shippingStore.availableCountries.length ? 
                `${shippingStore.availableCountries.length} countries available` : 
                'Loading available countries...'"
            >
              <n-select
                v-model:value="selectedCountry"
                :options="countryOptions"
                :loading="shippingStore.isLoading"
                :disabled="shippingStore.isLoading || isProcessing"
                filterable
                placeholder="Search and select a country..."
                clearable
              />
            </n-form-item>

            <n-form-item
              v-if="selectedCountry && shippingStore.availableWarehouses.length > 1"
              label="Shipping Method"
              feedback="Select your preferred shipping option"
            >
              <n-select
                v-model:value="selectedWarehouse"
                :options="warehouseOptions"
                :disabled="isProcessing"
                filterable
                placeholder="Select a shipping method..."
                clearable
              />
            </n-form-item>

            <n-space justify="end">
              <n-button
                type="primary"
                :disabled="!canProceed || isProcessing"
                :loading="isProcessing"
                @click="proceed"
                size="large"
              >
                {{ route.query.redirect ? 'Continue' : 'Continue to Products' }}
              </n-button>
            </n-space>
          </n-form>
        </n-card>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NH1,
  NSpin,
  NAlert,
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NSpace,
  NButton
} from 'naive-ui'
import { useShippingStore } from '../stores/shipping'
import { useCartStore } from '../stores/cart'
import { showNotification, UI_CONSTANTS } from '../utils/ui'
import type { Country } from 'rust_iso3166-ts'
import { formatPrice } from '@gofranz/checkoutbay-common'

const router = useRouter()
const route = useRoute()
const shippingStore = useShippingStore()
const isLoading = ref(true)
const isProcessing = ref(false)

const selectedCountry = ref<string>('')
const selectedWarehouse = ref<string>('')

const countryOptions = computed(() => {
  const countries = shippingStore.availableCountries
  if (!countries || !Array.isArray(countries)) {
    console.log('No countries available')
    return []
  }
  return countries.map((country: Country) => ({
    label: country.name,
    value: country.alpha2,
    description: `Code: ${country.alpha2}`,
    key: country.alpha2
  }))
})

const toTitleCase = (str: string) => {
  return str.toLowerCase().split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const warehouseOptions = computed(() => 
  shippingStore.availableWarehouses.map(warehouse => {
    const rate = warehouse.rates.find(r => 
      r.countries.includes(selectedCountry.value)
    )
    const freeAboveText = rate?.free_above_value ? 
      ` (Free above ${formatPrice(rate.free_above_value, warehouse.currency)})` : 
      ''
    return {
      label: `${warehouse.provider} - ${toTitleCase(warehouse.service_level)} Shipping`,
      value: warehouse.warehouse_id,
      description: rate ? 
        `Shipping cost: ${formatPrice(rate.amount, warehouse.currency)}${freeAboveText}` :
        'Shipping rate not available',
      key: warehouse.warehouse_id
    }
  })
)

const canProceed = computed(() => {
  if (!selectedCountry.value) return false
  if (shippingStore.availableWarehouses.length > 1 && !selectedWarehouse.value) return false
  return true
})

const cartStore = useCartStore()

const proceed = async () => {
  if (!canProceed.value || isProcessing.value) return
  isProcessing.value = true

  try {
    // Update shipping details
    shippingStore.setCountry(selectedCountry.value)
    if (selectedWarehouse.value) {
      shippingStore.setWarehouse(selectedWarehouse.value)
    } else if (shippingStore.availableWarehouses.length === 1) {
      // Auto-select the only available warehouse
      shippingStore.setWarehouse(shippingStore.availableWarehouses[0].warehouse_id)
    }

    // Recalculate cart with new country
    if (!cartStore.isEmpty) {
      await cartStore.calculateOrder()
    }

    // Show success notification
    const selectedCountryName = countryOptions.value.find(c => c.value === selectedCountry.value)?.label
    showNotification.success({
      title: 'Shipping Details Updated',
      content: `Your order will be shipped to ${selectedCountryName}`,
      duration: 3000
    })

    // Check if there's a redirect path
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      await router.push(redirect)
    } else {
      await router.push({ name: 'product-selection' })
    }
  } catch (error) {
    showNotification.error({
      title: 'Navigation Error',
      content: 'Failed to proceed. Please try again.',
      duration: 0
    })
    console.error('Navigation error:', error)
  } finally {
    isProcessing.value = false
  }
}

onMounted(async () => {
  try {
    await shippingStore.fetchShippingRates()
    
    // Pre-select country and warehouse if they exist in localStorage
    if (shippingStore.selectedCountry) {
      selectedCountry.value = shippingStore.selectedCountry
    }
    if (shippingStore.selectedWarehouse) {
      selectedWarehouse.value = shippingStore.selectedWarehouse
    }
  } catch (e) {
    console.error('Failed to fetch shipping rates:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: v-bind('UI_CONSTANTS.MAX_WIDTH.xl');
  margin: 0 auto;
  padding: v-bind('UI_CONSTANTS.SPACING.xl');
}

.form-container {
  max-width: v-bind('UI_CONSTANTS.MAX_WIDTH.sm');
  margin: v-bind('UI_CONSTANTS.SPACING.lg') auto 0;
}
</style>
