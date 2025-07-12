// Export all generated types from Rust backend
export * from './generated';

// Generic response wrapper
export interface GenericListResponse<T> {
  data: T[];
  total: number;
}