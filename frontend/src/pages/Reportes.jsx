import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Reportes() {
  const [resumen, setResumen] = useState({
    usuarios: 0,
    productos: 0,
    categorias: 0,
    stock_bajo: 0
  });

  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarReportes() {
      try {
        const respuestaResumen = await fetch(`${API_URL}/dashboard/resumen`, {
        headers: getAuthHeaders()
        });
        const datosResumen = await respuestaResumen.json();

        const respuestaStock = await fetch(`${API_URL}/dashboard/stock-bajo`, {
          headers: getAuthHeaders()
        });
        const datosStock = await respuestaStock.json();

        if (activo) {
          setResumen(datosResumen);
          setProductosStockBajo(datosStock);
          setCargando(false);
        }
      } catch (error) {
        console.error("Error al cargar reportes:", error);

        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarReportes();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <main className="content">
        <h1>Cargando reportes...</h1>
      </main>
    );
  }

  return (
    <main className="content">
      <h1>Reportes</h1>
      <p>Resumen de información de la tienda</p>

      <div className="summary-grid report-grid">
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

      <section className="table-card reports-table">
        <h2>Reporte de productos con bajo stock</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {productosStockBajo.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${Number(producto.precio).toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>{producto.estado}</td>
              </tr>
            ))}

            {productosStockBajo.length === 0 && (
              <tr>
                <td colSpan="6">No hay productos con bajo stock</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Reportes;