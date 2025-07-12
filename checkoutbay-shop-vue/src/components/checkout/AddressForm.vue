<template>
  <n-form ref="formRef" :model="formData" :rules="validationRules">
    <n-form-item label="Full Name" path="recipient_name">
      <n-input
        v-model:value="formData.recipient_name"
        placeholder="John Doe"
      />
    </n-form-item>

    <n-form-item label="Street Address" path="street">
      <n-input
        v-model:value="formData.street"
        placeholder="123 Main St"
      />
    </n-form-item>

    <n-form-item label="Apartment, suite, etc. (optional)">
      <n-input
        v-model:value="formData.street2"
        placeholder="Apt 4B"
      />
    </n-form-item>

    <n-grid :cols="2" :x-gap="12">
      <n-grid-item>
        <n-form-item label="City" path="city">
          <n-input
            v-model:value="formData.city"
            placeholder="New York"
          />
        </n-form-item>
      </n-grid-item>

      <n-grid-item>
        <n-form-item label="State/Province" path="state">
          <n-select
            v-model:value="formData.state"
            :options="subdivisionOptions"
            placeholder="Select state..."
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>

    <n-grid :cols="2" :x-gap="12">
      <n-grid-item>
        <n-form-item label="ZIP/Postal Code" path="zip">
          <n-input
            v-model:value="formData.zip"
            placeholder="10001"
          />
        </n-form-item>
      </n-grid-item>

      <n-grid-item>
        <n-form-item label="Phone (optional)">
          <n-input
            v-model:value="formData.phone"
            placeholder="+1 (555) 555-5555"
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>

    <n-form-item label="Country">
      <n-input
        :value="countryName"
        readonly
        disabled
      />
    </n-form-item>

    <n-space vertical>
      <n-space align="center">
        <n-text>This is a business address</n-text>
        <n-switch v-model:value="isBusinessAddress" />
      </n-space>

      <n-collapse-transition :show="isBusinessAddress">
        <div>
          <n-form-item label="Company Name">
            <n-input
              v-model:value="formData.company_name"
              placeholder="Company Inc."
            />
          </n-form-item>

          <n-form-item label="VAT Number (optional)">
            <n-input
              v-model:value="formData.vat_number"
              placeholder="VAT12345"
            />
          </n-form-item>
        </div>
      </n-collapse-transition>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NGrid,
  NGridItem,
  NSpace,
  NSwitch,
  NText,
  NCollapseTransition
} from 'naive-ui'
import { useShippingStore } from '../../stores/shipping'
import type { InlineAddress } from '../../types'
import { createAddressValidationRules } from '../../utils/validation'

const props = defineProps<{
  modelValue: InlineAddress | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InlineAddress): void
}>()

const shippingStore = useShippingStore()
const isBusinessAddress = ref(false)
const formRef = ref()

// Validation rules
const validationRules = createAddressValidationRules()

// Get country name from shipping store
const countryName = computed(() => {
  const country = shippingStore.availableCountries.find(
    c => c.alpha2 === shippingStore.selectedCountry
  )
  return country?.name || shippingStore.selectedCountry || ''
})

// Initialize form data
const formData = ref<InlineAddress>({
  recipient_name: '',
  street: '',
  street2: '',
  city: '',
  state: '',
  country: shippingStore.selectedCountry || '',
  zip: '',
  phone: '',
  company_name: '',
  vat_number: '',
  ...props.modelValue
})

// Format subdivisions for n-select
const subdivisionOptions = computed(() => 
  shippingStore.countrySubdivisions.map(subdivision => ({
    label: subdivision.name,
    value: subdivision.alpha2
  }))
)

// Watch for business address toggle
watch(isBusinessAddress, (newValue) => {
  if (!newValue) {
    formData.value.company_name = ''
    formData.value.vat_number = ''
    emit('update:modelValue', { ...formData.value })
  }
})

// Watch for initial value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && JSON.stringify(newValue) !== JSON.stringify(formData.value)) {
    formData.value = { ...newValue }
    isBusinessAddress.value = !!newValue.company_name
  }
}, { immediate: true })

// Watch individual form fields instead of the entire object
watch(() => ({
  recipient_name: formData.value.recipient_name,
  street: formData.value.street,
  street2: formData.value.street2,
  city: formData.value.city,
  state: formData.value.state,
  country: formData.value.country,
  zip: formData.value.zip,
  phone: formData.value.phone,
  company_name: formData.value.company_name,
  vat_number: formData.value.vat_number
}), (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })
</script>
