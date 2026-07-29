import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Dashboard() {
  const [resumen, setResumen] = useState({
    usuarios: 0,
    productos: 0,
    categorias: 0,
    stock_bajo: 0
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarResumen() {
      try {
        const respuesta = await fetch(`${API_URL}/dashboard/resumen`, {
         headers: getAuthHeaders()
        });
        const datos = await respuesta.json();

        if (activo) {
          setResumen(datos);
          setCargando(false);
        }
      } catch (error) {
        console.error("Error al obtener resumen:", error);

        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarResumen();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <main className="content">
        <h1>Cargando dashboard...</h1>
      </main>
    );
  }

  return (
    <main className="content">
      <h1>Bienvenido al Dashboard</h1>
      <p>Resumen general de la tienda en línea</p>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Usuarios</h3>
          <p>{resumen.usuarios}</p>
        </div>

        <div className="summary-card">
          <h3>Productos</h3>
          <p>{resumen.productos}</p>
        </div>

        <div className="summary-card">
          <h3>Categorías</h3>
          <p>{resumen.categorias}</p>
        </div>

        <div className="summary-card">
          <h3>Stock bajo</h3>
          <p>{resumen.stock_bajo}</p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;