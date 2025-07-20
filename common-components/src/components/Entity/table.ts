import { Currency, ShopEntityAccessParams } from "@gofranz/common";

export interface CommonTableProps<Entity, Update> {
  pagination: {
    total: number;
    initial: number;
    perPage: number;
  };
  onChange: (params: { nextPage: number; is_spam?: boolean }) => Promise<Entity[]>;
  openRowPage: (form: Entity) => void;
  updateCb?: (
    params: ShopEntityAccessParams,
    data: Update
  ) => Promise<void>;
  deleteCb?: (params: ShopEntityAccessParams) => Promise<void>;
  primaryEntityId: string
  shopCurrency: Currency
}
