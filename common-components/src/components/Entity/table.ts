import { Currency } from "@gofranz/common";

export interface CommonTableProps<Entity, Update> {
  pagination: {
    total: number;
    initial: number;
    perPage: number;
  };
  onChange: (params: { nextPage: number; is_spam?: boolean }) => Promise<Entity[]>;
  openRowPage: (form: Entity) => void;
  updateCb?: (
    id: string,
    data: Update
  ) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
  shopId: string
  shopCurrency: Currency
}
