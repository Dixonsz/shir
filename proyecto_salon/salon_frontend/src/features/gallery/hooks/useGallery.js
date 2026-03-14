import { useState, useEffect } from "react";
import { galleryApi } from "../api";

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.getAllAdmin();
      setGalleryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar galería:', err);
      setError(err.response?.data?.message || "Error al cargar galería");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (formData) => {
    try {
      const newItem = await galleryApi.uploadImage(formData);
      setGalleryItems((prev) => [...(Array.isArray(prev) ? prev : []), newItem]);
      return { success: true, data: newItem };
    } catch (err) {
      console.error('Error upload galeria:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || "Error al subir imagen",
      };
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const updatedItem = await galleryApi.update(id, itemData);
      setGalleryItems((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => (item.id === id ? updatedItem : item))
          : []
      );
      return { success: true, data: updatedItem };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar item",
      };
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log('Intentando eliminar permanentemente item con ID:', id);
      const result = await galleryApi.delete(id);
      console.log('Resultado de la eliminación:', result);
      setGalleryItems((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar item:', err);
      console.error('Respuesta del servidor:', err.response);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Error al eliminar item",
      };
    }
  };

  const toggleItemStatus = async (id) => {
    try {
      console.log('Intentando cambiar estado del item con ID:', id);
      const updatedItem = await galleryApi.toggleStatus(id);
      console.log('Resultado del toggle:', updatedItem);
      setGalleryItems((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => (item.id === id ? updatedItem : item))
          : []
      );
      return { success: true, data: updatedItem };
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Error al cambiar estado",
      };
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return {
    galleryItems,
    loading,
    error,
    fetchGallery,
    uploadImage,
    updateItem,
    deleteItem,
    toggleItemStatus,
  };
}







