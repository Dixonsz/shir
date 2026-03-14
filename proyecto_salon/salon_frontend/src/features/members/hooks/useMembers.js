import { useState,useEffect } from "react";
import { membersApi } from "../api";
import { rolesApi } from "../../roles/api";

export function useMembers() {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await membersApi.getAll();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar miembros");
    } finally {
      setLoading(false);
    }  
    };

    const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
    };
    const createMember = async (memberData) => {    
    try {
      const newMember = await membersApi.create(memberData);
      setMembers((prev) => [...(Array.isArray(prev) ? prev : []), newMember]);
      return { success: true, data: newMember };
    
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al crear miembro",
      };
    }
    };

    const updateMember = async (id, memberData) => {    
    try {
      const updatedMember = await membersApi.update(id, memberData);
        setMembers((prev) => 
        Array.isArray(prev) ? prev.map((member) => (member.id === id ? updatedMember : member)) : []
      );
      return { success: true, data: updatedMember };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar miembro",
      };
    }

    };

    const deleteMember = async (id) => {    
    try {
      await membersApi.delete(id);
        setMembers((prev) => Array.isArray(prev) ? prev.filter((member) => member.id !== id) : []);
        return { success: true };
    } catch (err) {
        return {
        success: false,
        error: err.response?.data?.message || "Error al eliminar miembro",
      };
    }
    };

    useEffect(() => {
    fetchMembers();
    fetchRoles();
    }, []);

    return {
    members,
    roles,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  };
}







