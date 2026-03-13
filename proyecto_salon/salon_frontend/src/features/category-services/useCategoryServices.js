import { useState, useEffect } from "react";
import { categoryServicesApi } from "./category-services.api";

export function useCategoryServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryServicesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await categoryServicesApi.create(categoryData);
      setCategories((prev) => [...(Array.isArray(prev) ? prev : []), newCategory]);
      return { success: true, data: newCategory };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al crear categoría",
      };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await categoryServicesApi.update(id, categoryData);
      setCategories((prev) =>
        Array.isArray(prev)
          ? prev.map((category) =>
              category.id === id ? updatedCategory : category
            )
          : []
      );
      return { success: true, data: updatedCategory };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar categoría",
      };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryServicesApi.delete(id);
      setCategories((prev) =>
        Array.isArray(prev) ? prev.filter((category) => category.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al eliminar categoría",
      };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
