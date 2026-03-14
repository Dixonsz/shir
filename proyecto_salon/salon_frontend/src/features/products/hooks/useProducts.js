import { useState, useEffect } from "react";
import { productsApi } from "../api";
import { categoryProductsApi } from "../../category-products/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryProductsApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await productsApi.create(productData);
      setProducts((prev) => [...(Array.isArray(prev) ? prev : []), newProduct]);
      return { success: true, data: newProduct };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al crear producto",
      };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productsApi.update(id, productData);
      setProducts((prev) =>
        Array.isArray(prev)
          ? prev.map((product) =>
              product.id === id ? updatedProduct : product
            )
          : []
      );
      return { success: true, data: updatedProduct };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar producto",
      };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsApi.delete(id);
      setProducts((prev) =>
        Array.isArray(prev) ? prev.filter((product) => product.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al eliminar producto",
      };
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}







