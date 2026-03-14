import { createContext, useContext, useMemo, useState } from 'react';

const DEFAULT_PRESET = 'all';
const DEFAULT_SORT = 'none';

const TableFiltersContext = createContext(null);

function resolveDateRange(preset, customFrom, customTo) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (preset === 'custom') {
    const fromDate = customFrom ? new Date(`${customFrom}T00:00:00`) : null;
    const toDate = customTo ? new Date(`${customTo}T23:59:59`) : null;
    return {
      fromDate: fromDate && !Number.isNaN(fromDate.getTime()) ? fromDate : null,
      toDate: toDate && !Number.isNaN(toDate.getTime()) ? toDate : null,
    };
  }

  if (preset === 'day') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { fromDate: start, toDate: end };
  }

  if (preset === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { fromDate: start, toDate: end };
  }

  if (preset === 'month') {
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1);
    start.setHours(0, 0, 0, 0);
    return { fromDate: start, toDate: end };
  }

  if (preset === 'latest') {
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    return { fromDate: start, toDate: end };
  }

  return { fromDate: null, toDate: null };
}

export function TableFiltersProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState(DEFAULT_PRESET);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

  const dateRange = useMemo(
    () => resolveDateRange(datePreset, customFromDate, customToDate),
    [customFromDate, customToDate, datePreset]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setDatePreset(DEFAULT_PRESET);
    setSortOrder(DEFAULT_SORT);
    setCustomFromDate('');
    setCustomToDate('');
  };

  const value = {
    searchQuery,
    setSearchQuery,
    datePreset,
    setDatePreset,
    sortOrder,
    setSortOrder,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    clearFilters,
  };

  return <TableFiltersContext.Provider value={value}>{children}</TableFiltersContext.Provider>;
}

export function useTableFilters() {
  const context = useContext(TableFiltersContext);
  if (!context) {
    throw new Error('useTableFilters must be used within a TableFiltersProvider');
  }
  return context;
}
