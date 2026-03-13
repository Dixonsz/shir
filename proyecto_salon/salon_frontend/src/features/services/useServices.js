import { useState, useEffect } from "react";
import { servicesApi } from "./services.api";
import { categoryServicesApi } from "../category-services/category-services.api";

export function useServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getAll();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryServicesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const createService = async (serviceData) => {
    try {
      const newService = await servicesApi.create(serviceData);
      setServices((prev) => [...(Array.isArray(prev) ? prev : []), newService]);
      return { success: true, data: newService };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al crear servicio",
      };
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const updatedService = await servicesApi.update(id, serviceData);
      setServices((prev) =>
        Array.isArray(prev)
          ? prev.map((service) =>
              service.id === id ? updatedService : service
            )
          : []
      );
      return { success: true, data: updatedService };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar servicio",
      };
    }
  };

  const deleteService = async (id) => {
    try {
      await servicesApi.delete(id);
      setServices((prev) =>
        Array.isArray(prev) ? prev.filter((service) => service.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al eliminar servicio",
      };
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  return {
    services,
    categories,
    loading,
    error,
    fetchServices,
    fetchCategories,
    createService,
    updateService,
    deleteService,
  };
}
