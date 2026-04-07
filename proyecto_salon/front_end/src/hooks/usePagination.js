import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para paginación de cualquier endpoint que ya soporte paginación en el backend.
 * @param {Function} fetchFn - función que recibe ({ page, pageSize }) y retorna una promesa con { data, total, page, pages, page_size }
 * @param {Object} options - opciones iniciales
 * @param {number} options.initialPage
 * @param {number} options.pageSize
 */
export function usePagination(fetchFn, { initialPage = 1, pageSize = 10 } = {}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parsePaginationResponse = useCallback((response) => {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalItems: response.length,
        totalPages: 1,
      };
    }

    const payload = response || {};
    const nestedData = payload.data && typeof payload.data === 'object' ? payload.data : null;
    const meta =
      payload.pagination ||
      payload.meta ||
      nestedData?.pagination ||
      nestedData?.meta ||
      {};

    const items =
      (Array.isArray(payload.data) && payload.data) ||
      (Array.isArray(nestedData?.data) && nestedData.data) ||
      payload.items ||
      nestedData?.items ||
      payload.results ||
      nestedData?.results ||
      payload.rows ||
      nestedData?.rows ||
      payload.records ||
      nestedData?.records ||
      [];

    const totalItems =
      meta.total ??
      payload.total ??
      nestedData?.total ??
      payload.total_items ??
      nestedData?.total_items ??
      payload.totalItems ??
      nestedData?.totalItems ??
      (Array.isArray(items) ? items.length : 0);

    const totalPages =
      meta.pages ??
      payload.pages ??
      nestedData?.pages ??
      payload.total_pages ??
      nestedData?.total_pages ??
      payload.totalPages ??
      nestedData?.totalPages ??
      Math.max(
        1,
        Math.ceil(totalItems / (meta.page_size || payload.page_size || nestedData?.page_size || payload.pageSize || nestedData?.pageSize || pageSizeState || 1))
      );

    return {
      items: Array.isArray(items) ? items : [],
      totalItems,
      totalPages,
    };
  }, [pageSizeState]);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ page, pageSize: pageSizeState });
      const parsed = parsePaginationResponse(res);
      setData(parsed.items);
      setTotal(parsed.totalItems);
      setPages(parsed.totalPages || 1);
    } catch (err) {
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSizeState, parsePaginationResponse]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const goToPage = (p) => {
    setPage((current) => {
      const nextPage = Number.isFinite(Number(p)) ? Number(p) : current;
      return Math.max(1, nextPage);
    });
  };
  const nextPage = () => setPage((p) => Math.min(p + 1, pages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const setPageSize = (size) => {
    const normalized = Number(size);
    if (!Number.isFinite(normalized) || normalized <= 0) return;
    setPageSizeState(normalized);
    setPage(1);
  };

  return {
    data,
    page,
    total,
    pages,
    pageSize: pageSizeState,
    loading,
    error,
    setPage: goToPage,
    nextPage,
    prevPage,
    setPageSize,
    refresh: loadPage,
  };
}
