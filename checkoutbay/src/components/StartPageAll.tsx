import {
  Address,
  Discount,
  DiscountsQueryParams,
  Order,
  PaymentGateway,
  Product,
  ShippingRateTemplate,
  ShopQueryParams,
  StockMovement,
  UpdateAddres,
  UpdateDiscount,
  UpdatePaymentGateway,
  UpdateProduct,
  UpdateShippingRateTemplate,
  UpdateStockMovement,
  UpdateWarehouse,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import { useTranslation } from 'react-i18next';
import { useRustyState } from "../state";
import { AddressesTable } from "./Addresses/AddressesTable";
import { DiscountsTable } from "./Discounts/DiscountsTable";
import { GeneralizedStartPage } from "./Entity/EntityStartPage";
import { OrdersTable } from "./Orders/OrdersTable";
import { PaymentMethodsTable } from "./PaymentMethods/PaymentMethodTable";
import { ProductsTable } from "./Products/ProductsTable";
import { ShippingRateTemplatesTable } from "./ShippingRateTemplates/ShippingRateTemplatesTable";
import { StockMovementsTable } from "./StockMovements/StockMovementsTable";
import { WarehousesTable } from "./Warehouses/WarehousesTable";

export function AccountProductStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Product, ShopQueryParams, UpdateProduct>
      TableComponent={ProductsTable}
      getFunction={api.getProducts}
      createPath="/account/products/create"
      openPath={(entity) => `/account/products/${entity.id}`}
      updateCb={api.updateProduct}
      deleteCb={api.deleteProduct}
      buttonText={t('entities.newProduct')}
      headerText={t('entities.newProductDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountWarehouseStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Warehouse, ShopQueryParams, UpdateWarehouse>
      TableComponent={WarehousesTable}
      getFunction={api.getWarehouses}
      createPath="/account/warehouses/create"
      openPath={(entity) => `/account/warehouses/${entity.id}`}
      updateCb={api.updateWarehouse}
      deleteCb={api.deleteWarehouse}
      buttonText={t('entities.newWarehouse')}
      headerText={t('entities.newWarehouseDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountAddressStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Address, ShopQueryParams, UpdateAddres>
      TableComponent={AddressesTable}
      getFunction={api.getAddresses}
      createPath="/account/addresses/create"
      openPath={(entity) => `/account/addresses/${entity.id}`}
      updateCb={api.updateAddress}
      deleteCb={api.deleteAddress}
      buttonText={t('entities.newAddress')}
      headerText={t('entities.newAddressDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountStockMovementStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<StockMovement, ShopQueryParams, UpdateStockMovement>
      TableComponent={StockMovementsTable}
      getFunction={api.getStockMovements}
      createPath="/account/stock-movements/create"
      openPath={(entity) => `/account/stock-movements/${entity.id}`}
      updateCb={api.updateStockMovement}
      deleteCb={api.deleteStockMovement}
      buttonText={t('entities.newStockMovement')}
      headerText={t('entities.newStockMovementDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountPaymentMethodStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<PaymentGateway, ShopQueryParams, UpdatePaymentGateway>
      TableComponent={PaymentMethodsTable}
      getFunction={api.getPaymentGateways}
      createPath="/account/payment-gateways/create"
      openPath={(entity) => `/account/payment-gateways/${entity.id}`}
      updateCb={api.updatePaymentGateway}
      deleteCb={api.deletePaymentGateway}
      buttonText={t('entities.newPaymentMethod')}
      headerText={t('entities.newPaymentMethodDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountOrderStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Order, ShopQueryParams, undefined>
      TableComponent={OrdersTable}
      getFunction={api.getOrders}
      // createPath="/account/orders/create"
      openPath={(entity) => `/account/orders/${entity.id}`}
      // changeCb={api.getAddresses}
      // updateCb={api.updateOrder}
      // deleteCb={api.deleteOrder}
      buttonText={t('entities.newOrder')}
      headerText={t('entities.newOrderDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function ShippingRateTemplateStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<ShippingRateTemplate, ShopQueryParams, UpdateShippingRateTemplate>
      TableComponent={ShippingRateTemplatesTable}
      getFunction={api.getShippingRateTemplates}
      createPath="/account/shipping-rate-templates/create"
      openPath={(entity) => `/account/shipping-rate-templates/${entity.id}`}
      updateCb={api.updateShippingRateTemplate}
      deleteCb={api.deleteShippingRateTemplate}
      buttonText={t('entities.newShippingRateTemplate')}
      headerText={t('entities.newShippingRateTemplateDescription')}
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountDiscountStartPage() {
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Discount, DiscountsQueryParams, UpdateDiscount>
      TableComponent={DiscountsTable}
      getFunction={api.getDiscounts}
      createPath="/account/discounts/create"
      openPath={(entity) => `/account/discounts/${entity.id}`}
      updateCb={api.updateDiscount}
      deleteCb={api.deleteDiscount}
      buttonText="New Discount"
      headerText="Create and manage discounts for your store"
      shopId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}