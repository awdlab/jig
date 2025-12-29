export type PaginationState = {
  page: {
    size: number;
    current: number;
  };
  slice: {
    skip: number;
    take: number;
  };
};
