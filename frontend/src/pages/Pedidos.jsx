import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarPedidos() {
      try {
        const respuesta = await fetch(`${API_URL}/pedidos`, {
          headers: getAuthHeaders()
        });

        const datos = await respuesta.json();

        if (activo) {
          if (!respuesta.ok) {
            setMensaje(datos.mensaje || "No se pudieron cargar los pedidos");
            setPedidos([]);
          } else {
            setPedidos(datos);
          }

          setCargando(false);
        }
      } catch (error) {
        console.error("Error al cargar pedidos:", error);

        if (activo) {
          setMensaje("No se pudo conectar con el servidor");
          setCargando(false);
        }
      }
    }

    cargarPedidos();

    return () => {
      activo = false;
    };
  }, []);

  const verDetalle = async (idPedido) => {
    setMensaje("");

    try {
      const respuesta = await fetch(`${API_URL}/pedidos/${idPedido}`, {
        headers: getAuthHeaders()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo obtener el detalle del pedido");
        return;
      }

      setDetallePedido(datos);
    } catch (error) {
      console.error("Error al obtener detalle:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  const cerrarDetalle = () => {
    setDetallePedido(null);
  };

  if (cargando) {
    return (
      <main className="content">
        <h1>Cargando pedidos...</h1>
      </main>
    );
  }

  return (
    <main className="content">
      <h1>Pedidos</h1>
      <p>Consulta de pedidos realizados por los clientes</p>

      {mensaje && <p className="info-message">{mensaje}</p>}

      <section className="table-card orders-table">
        <h2>Lista de pedidos</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.correo}</td>
                <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                <td>${Number(pedido.total).toFixed(2)}</td>
                <td>{pedido.estado}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => verDetalle(pedido.id_pedido)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {pedidos.length === 0 && (
              <tr>
                <td colSpan="7">No hay pedidos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {detallePedido && (
        <section className="table-card order-detail-card">
          <div className="detail-header">
            <h2>Detalle del pedido #{detallePedido.pedido.id_pedido}</h2>
            <button className="secondary-button" onClick={cerrarDetalle}>
              Cerrar
            </button>
          </div>

          <div className="order-summary">
            <p>
              <strong>Cliente:</strong> {detallePedido.pedido.cliente}
            </p>
            <p>
              <strong>Correo:</strong> {detallePedido.pedido.correo}
            </p>
            <p>
              <strong>Total:</strong> $
              {Number(detallePedido.pedido.total).toFixed(2)}
            </p>
            <p>
              <strong>Estado:</strong> {detallePedido.pedido.estado}
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {detallePedido.detalles.map((detalle) => (
                <tr key={detalle.id_detalle}>
                  <td>{detalle.producto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>${Number(detalle.precio_unitario).toFixed(2)}</td>
                  <td>${Number(detalle.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default Pedidos;