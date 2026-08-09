const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export default API_URL;