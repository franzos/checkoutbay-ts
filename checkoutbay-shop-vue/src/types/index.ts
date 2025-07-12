import type { Country, Subdivision } from 'rust_iso3166-ts'
import type { 
  PublicShippingRate, 
  PublicProduct, 
  ProcessedOrder,
  ProcessedOrderPreview,
  InlineAddress
} from '@gofranz/checkoutbay-common'

export type {
  Country,
  Subdivision,
  PublicShippingRate,
  PublicProduct,
  ProcessedOrder,
  ProcessedOrderPreview,
  InlineAddress
}

export interface CartItem {
  productId: string
  quantity: number
  product?: PublicProduct
}

export interface CheckoutState {
  shippingAddress: InlineAddress | null
  billingAddress: InlineAddress | null
  email: string
}

export interface ShippingState {
  selectedCountry: string
  selectedWarehouse: string | null
  availableRates: PublicShippingRate[]
}
