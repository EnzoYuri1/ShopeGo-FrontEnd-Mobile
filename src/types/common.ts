export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
}
