export interface QueryParamsBase {
    offset?: number;
    limit?: number;
  }

  export interface GenericResponse {
    status: number;
    data?: any;
  }  
  
  export interface TypedGenericResponse<T> {
    status: number;
    data?: T;
  }
  
  export interface ListResponse<T> {
    data: T[];
    total: number;
  }
  
  export type ExtendedListResponse<T, R> = ListResponse<T> & {
    [key: string]: R | T[] | number;
  };