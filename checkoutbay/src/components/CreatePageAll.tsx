import {
  Address,
  Discount,
  NewAddress,
  NewDiscount,
  NewPaymentGateway,
  NewProduct,
  NewShippingRateTemplate,
  NewStockMovement,
  NewWarehouse,
  PaymentGateway,
  Product,
  ShippingRateTemplate,
  StockMovement,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import { GeneralizedCreatePage } from "@gofranz/common-components";
import { useRustyState } from "../state";
import {
  CreateAddress,
  CreateDiscount,
  CreatePaymentMethod,
  CreateProduct,
  CreateShippingRateTemplate,
  CreateStockMovement,
  CreateWarehouse,
} from "./CreatingAll";

export function AccountProductCreatePage() {
  return (
    <GeneralizedCreatePage<Product, NewProduct>
      CreateComponent={CreateProduct}
      createFunction={useRustyState.getState().api.createProduct}
      redirectPath={(entity) => `/account/products/${entity.id}`}
    />
  );
}

export function AccountWarehouseCreatePage() {
  return (
    <GeneralizedCreatePage<Warehouse, NewWarehouse>
      CreateComponent={CreateWarehouse}
      createFunction={useRustyState.getState().api.createWarehouse}
      redirectPath={(entity) => `/account/warehouses/${entity.id}`}
    />
  );
}

export function AccountAddressCreatePage() {
  return (
    <GeneralizedCreatePage<Address, NewAddress>
      CreateComponent={CreateAddress}
      createFunction={useRustyState.getState().api.createAddress}
      redirectPath={(entity) => `/account/addresses/${entity.id}`}
    />
  );
}

export function AccountStockMovementCreatePage() {
  return (
    <GeneralizedCreatePage<StockMovement, NewStockMovement>
      CreateComponent={CreateStockMovement}
      createFunction={useRustyState.getState().api.createStockMovement}
      redirectPath={(entity) => `/account/stock-movements/${entity.id}`}
    />
  );
}

export function AccountPaymentMethodCreatePage() {
  return (
    <GeneralizedCreatePage<PaymentGateway, NewPaymentGateway>
      CreateComponent={CreatePaymentMethod}
      createFunction={useRustyState.getState().api.createPaymentGateway}
      redirectPath={(entity) => `/account/payment-gateways/${entity.id}`}
    />
  );
}

export function AccountShippingRateTemplateCreatePage() {
  return (
    <GeneralizedCreatePage<ShippingRateTemplate, NewShippingRateTemplate>
      CreateComponent={CreateShippingRateTemplate}
      createFunction={useRustyState.getState().api.createShippingRateTemplate}
      redirectPath={(entity) => `/account/shipping-rate-templates/${entity.id}`}
    />
  );
}

export function AccountDiscountCreatePage() {
  return (
    <GeneralizedCreatePage<Discount, NewDiscount>
      CreateComponent={CreateDiscount}
      createFunction={useRustyState.getState().api.createDiscount}
      redirectPath={(entity) => `/account/discounts/${entity.id}`}
    />
  );
}