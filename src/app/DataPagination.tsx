import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/data-controls.css";

export const TABLE_PAGE_SIZE = 10;

export function usePaginatedItems<T>(
  items: readonly T[],
  resetKey: string,
  pageSize = TABLE_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => setPage(1), [resetKey]);
  useEffect(() => setPage((value) => Math.min(value, pageCount)), [pageCount]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { page, pageCount, pageItems, setPage, pageSize };
}

export function DataPagination({
  page,
  pageCount,
  totalItems,
  pageSize = TABLE_PAGE_SIZE,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (value) =>
      pageCount <= 5 ||
      value === 1 ||
      value === pageCount ||
      Math.abs(value - page) <= 1,
  );

  return (
    <nav className="data-pagination" aria-label="Страницы таблицы">
      <span className="data-pagination__summary">
        {start}–{end} из {totalItems}
      </span>
      <div className="data-pagination__buttons">
        <button
          type="button"
          aria-label="Предыдущая страница"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        {pages.map((value, index) => {
          const previous = pages[index - 1];
          return (
            <span className="data-pagination__page-wrap" key={value}>
              {previous && value - previous > 1 && (
                <span className="data-pagination__ellipsis" aria-hidden="true">…</span>
              )}
              <button
                type="button"
                className={value === page ? "is-active" : undefined}
                aria-current={value === page ? "page" : undefined}
                aria-label={`Страница ${value}`}
                onClick={() => onPageChange(value)}
              >
                {value}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          aria-label="Следующая страница"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
