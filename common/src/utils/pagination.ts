export interface PaginationHelper {
  total: number;
  initial: number;
  active: number;
  onChange: (page: number) => void;
}
