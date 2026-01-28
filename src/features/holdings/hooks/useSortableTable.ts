import { useState, useMemo } from "react";

export type SortField = "symbol" | "name" | "percent" | "shares" | "price" | "value" | "change";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface UseSortableTableParams<T> {
  data: T[];
  initialSort?: SortState;
  initialItemsPerPage?: number;
  sortFn: (a: T, b: T, field: SortField) => number;
}

export interface UseSortableTableReturn<T> {
  sortedData: T[];
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sort: SortState;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  handleSort: (field: SortField) => void;
}

export function useSortableTable<T>({
  data,
  initialSort = { field: "percent" as SortField, direction: "desc" },
  initialItemsPerPage = 20,
  sortFn,
}: UseSortableTableParams<T>): UseSortableTableReturn<T> {
  const [sort, setSort] = useState<SortState>(initialSort);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const compareResult = sortFn(a, b, sort.field);
      return sort.direction === "asc" ? compareResult : -compareResult;
    });
  }, [data, sort, sortFn]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
    setCurrentPage(1);
  };

  return {
    sortedData,
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    sort,
    setCurrentPage,
    setItemsPerPage: (items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1);
    },
    handleSort,
  };
}
