import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportsApi } from '../api/reports.api';

const DEFAULT_LIMIT = 10;

export function useReports(filters) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [revenueTimeline, setRevenueTimeline] = useState([]);
  const [inventory, setInventory] = useState({ low_stock: [], out_of_stock: [], total_inventory_value: 0 });

  const normalizedFilters = useMemo(
    () => ({
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      status: filters?.status || 'completed',
      limit: filters?.limit || DEFAULT_LIMIT,
    }),
    [filters]
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [
        summaryData,
        servicesData,
        productsData,
        clientsData,
        membersData,
        revenueData,
        inventoryData,
      ] = await Promise.all([
        reportsApi.getSummary(normalizedFilters),
        reportsApi.getServices(normalizedFilters),
        reportsApi.getProductsRelated(normalizedFilters),
        reportsApi.getClients(normalizedFilters),
        reportsApi.getMembers(normalizedFilters),
        reportsApi.getRevenueTimeline(normalizedFilters),
        reportsApi.getInventory({ lowStockThreshold: 5 }),
      ]);

      setSummary(summaryData);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
      setRevenueTimeline(Array.isArray(revenueData) ? revenueData : []);
      setInventory(inventoryData || { low_stock: [], out_of_stock: [], total_inventory_value: 0 });
    } catch (apiError) {
      setError(apiError?.userMessage || apiError?.message || 'No se pudieron cargar los reportes.');
    } finally {
      setLoading(false);
    }
  }, [normalizedFilters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    loading,
    error,
    summary,
    services,
    products,
    clients,
    members,
    revenueTimeline,
    inventory,
    refresh: fetchAll,
    filters: normalizedFilters,
  };
}
