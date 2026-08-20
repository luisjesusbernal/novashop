import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const formatoMoneda = (valor) => {
    return `$${Number(valor || 0).toFixed(2)}`;
  };

  const formatoFecha = (fecha) => {
    return fecha ? new Date(fecha).toLocaleString() : "No registrada";
  };

  const mostrarDato = (valor) => {
    return valor || "No registrado";
  };

  useEffect(() => {
    let activo = true;

    async function cargarPedidos() {
      try {
        const respuesta = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
          headers: getAuthHeaders(),
        });

        const datos = await respuesta.json();

        if (activo) {
          if (!respuesta.ok) {
            setMensaje(datos.mensaje || "No se pudieron cargar tus pedidos");
            setPedidos([]);
          } else {
            setPedidos(datos);
          }

          setCargando(false);
        }
      } catch (error) {
        console.error("Error al cargar mis pedidos:", error);

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
        headers: getAuthHeaders(),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo obtener el detalle");
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
        <h1>Cargando tus pedidos...</h1>
      </main>
    );
  }

  return (
    <main className="content">
      <h1>Mis pedidos</h1>
      <p>Consulta el historial de tus compras en TyrForge</p>

      {mensaje && <p className="info-message">{mensaje}</p>}

      <section className="table-card my-orders-table">
        <h2>Historial de pedidos</h2>

        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Subtotal</th>
              <th>Envío</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido}</td>
                <td>{formatoFecha(pedido.fecha_pedido)}</td>
                <td>{formatoMoneda(pedido.subtotal)}</td>
                <td>{formatoMoneda(pedido.costo_envio)}</td>
                <td>{formatoMoneda(pedido.total)}</td>
                <td>
                  <span className="status-badge">{pedido.estado}</span>
                </td>
                <td>{pedido.metodo_pago}</td>
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
                <td colSpan="8">Todavía no tienes pedidos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {detallePedido && (
        <section className="table-card order-detail-card">
          <div className="detail-header">
            <div>
              <h2>Detalle del pedido #{detallePedido.pedido.id_pedido}</h2>
              <p>
                Fecha: {formatoFecha(detallePedido.pedido.fecha_pedido)}
              </p>
            </div>

            <button className="secondary-button" onClick={cerrarDetalle}>
              Cerrar
            </button>
          </div>

          <div className="order-summary">
            <div>
              <h3>Estado del pedido</h3>
              <p>
                <strong>Estado:</strong> {detallePedido.pedido.estado}
              </p>
              <p>
                <strong>Método de pago:</strong>{" "}
                {detallePedido.pedido.metodo_pago}
              </p>
              <p>
                <strong>Método de envío:</strong>{" "}
                {mostrarDato(detallePedido.pedido.metodo_envio)}
              </p>
            </div>

            <div>
              <h3>Datos de entrega</h3>
              <p>
                <strong>Nombre:</strong>{" "}
                {mostrarDato(detallePedido.pedido.cliente)}
              </p>
              <p>
                <strong>Correo:</strong>{" "}
                {mostrarDato(detallePedido.pedido.correo)}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {mostrarDato(detallePedido.pedido.cliente_telefono)}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {mostrarDato(detallePedido.pedido.direccion_entrega)}
              </p>
              <p>
                <strong>Referencia:</strong>{" "}
                {mostrarDato(detallePedido.pedido.direccion_extra)}
              </p>
              <p>
                <strong>Código postal:</strong>{" "}
                {mostrarDato(detallePedido.pedido.codigo_postal)}
              </p>
              <p>
                <strong>Ciudad / Estado:</strong>{" "}
                {mostrarDato(detallePedido.pedido.ciudad)} /{" "}
                {mostrarDato(detallePedido.pedido.estado_entrega)}
              </p>
            </div>

            <div>
              <h3>Resumen</h3>
              <p>
                <strong>Subtotal:</strong>{" "}
                {formatoMoneda(detallePedido.pedido.subtotal)}
              </p>
              <p>
                <strong>Envío:</strong>{" "}
                {formatoMoneda(detallePedido.pedido.costo_envio)}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                {formatoMoneda(detallePedido.pedido.total)}
              </p>
            </div>
          </div>

          <h3>Productos del pedido</h3>

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
                  <td>{formatoMoneda(detalle.precio_unitario)}</td>
                  <td>{formatoMoneda(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default MisPedidos;