// Export all generated types from Rust backend
export * from './generated';
export * from './default'

// Generic response wrapper
export interface GenericListResponse<T> {
  data: T[];
  total: number;
}