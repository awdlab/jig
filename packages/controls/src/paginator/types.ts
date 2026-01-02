/**
 * Defines the pagination state including current page and slice information.
 * Depending on the context or API design, you can choose to use either page-based or slice-based pagination.
 */
export type PaginationState = {
  /**
   * The current pagination state in terms of page size and current page index.
   */
  page: {
    size: number;
    current: number;
  };
  /**
   * The slice of items to be displayed based on the current page and page size.
   */
  slice: {
    skip: number;
    take: number;
  };
};
