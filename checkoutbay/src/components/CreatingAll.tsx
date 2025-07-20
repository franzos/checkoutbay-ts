import {
  NewAddress,
  NewDiscount,
  NewPaymentGateway,
  NewProduct,
  NewShippingRateTemplate,
  NewStockMovement,
  NewWarehouse,
  PaymentGatewayConfig,
  NewProductDefault,
  NewAddressDefault,
  NewDiscountDefault,
  NewPaymentGatewayDefault,
  NewStockMovementDefault,
  NewWarehouseDefault,
  NewShippingRateTemplateDefault
} from '@gofranz/checkoutbay-common';
import { EntityFormCreate } from '@gofranz/common-components';
import { FormValidateInput } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useRustyState } from '../state';
import { RenderAddressFields } from './Addresses/AddressFields';
import { RenderDiscountFields } from './Discounts/DiscountFields';
import { RenderPaymentMethodFields } from './PaymentMethods/PaymentMethodFields';
import { RenderProductFields } from './Products/ProductFields';
import { RenderShippingRateTemplateFields } from './ShippingRateTemplates/ShippingRateTemplateFields';
import { RenderStockMovementsFields } from './StockMovements/StockMovementFields';
import { RenderWarehouseFields } from './Warehouses/WarehouseFields';
import { ShopEntitiesAccessParams } from '@gofranz/common';

export function CreateProduct({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewProduct) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewProduct>
      title="Create Product"
      description="Add a new product to your store."
      initialValues={NewProductDefault}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderProductFields}
      primaryEntityId={shopId}
    />
  );
}

export function CreateWarehouse({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewWarehouse) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewWarehouse>
      title="Create Warehouse"
      description="Add a new warehouse location."
      initialValues={NewWarehouseDefault}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderWarehouseFields}
      primaryEntityId={shopId}
    />
  );
}

export function CreateAddress({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewAddress) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewAddress>
      title="Create Address"
      description="Add a new address to your account."
      initialValues={NewAddressDefault}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderAddressFields}
      primaryEntityId={shopId}
    />
  );
}

export function CreateStockMovement({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewStockMovement) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewStockMovement>
      title="Create Stock Movement"
      description="Add a new stock movement to your account."
      initialValues={NewStockMovementDefault}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderStockMovementsFields}
      primaryEntityId={shopId}
    />
  );
}

const createPaymentGatewayValidation: FormValidateInput<NewPaymentGateway> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  provider_config: (value: PaymentGatewayConfig | undefined) => {
    if (!value) {
      return 'Provider is required';
    }
    return undefined;
  },
};

export function CreatePaymentMethod({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewPaymentGateway) => Promise<void>;
}) {
  const { t } = useTranslation();
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewPaymentGateway>
      title={t('entities.createPaymentMethod')}
      description={t('entities.createPaymentMethodDescription')}
      initialValues={NewPaymentGatewayDefault}
      validation={createPaymentGatewayValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderPaymentMethodFields}
      primaryEntityId={shopId}
    />
  );
}

export function CreateShippingRateTemplate({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewShippingRateTemplate) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  const defaultCurrency = useRustyState.getState().shopCurrency();

  return (
    <EntityFormCreate<NewShippingRateTemplate>
      title="Create Shipping Rate Template"
      description="Add a new shipping rate template to your account."
      initialValues={{
        ...NewShippingRateTemplateDefault,
        currency: defaultCurrency,
      }}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderShippingRateTemplateFields}
      primaryEntityId={shopId}
    />
  );
}

export function CreateDiscount({
  submitFormCb,
}: {
    submitFormCb: (params: ShopEntitiesAccessParams, data: NewDiscount) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewDiscount>
      title="Create Discount"
      description="Add a new discount to your store."
      initialValues={NewDiscountDefault}
      validation={{}}
      submitFormCb={submitFormCb}
      renderFields={RenderDiscountFields}
      primaryEntityId={shopId}
    />
  );
}
