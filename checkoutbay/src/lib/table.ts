import { Currency } from "@gofranz/common";

export interface CommonTableProps<T, U> {
  pagination: {
    total: number;
    initial: number;
    perPage: number;
  };
  onChange: (params: { nextPage: number; is_spam?: boolean }) => Promise<T[]>;
  openRowPage: (form: T) => void;
  updateCb?: (
    id: string,
    data: U
  ) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
  shopId: string
  shopCurrency: Currency
}
