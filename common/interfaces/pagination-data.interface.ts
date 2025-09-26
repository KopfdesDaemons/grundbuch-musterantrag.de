export interface PaginatedApiResponse<T> {
  page: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}
