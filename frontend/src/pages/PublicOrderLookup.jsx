import { useState } from "react";
import API_URL from "../services/api";

function PublicOrderLookup() {
  const [folio, setFolio] = useState("");
  const [correo, setCorreo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const consultarPedido = async (e) => {
    e.preventDefault();

    setError("");
    setResultado(null);

    if (!folio || !correo) {
      setError("Ingresa el folio del pedido y el correo electrónico.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(
        `${API_URL}/pedidos/consulta/${folio}?correo=${encodeURIComponent(
          correo
        )}`
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || "No se pudo consultar el pedido");
      }

      setResultado(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section>
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="fw-bold text-center mb-2">Consultar pedido</h2>

              <p className="text-muted text-center mb-4">
                Ingresa tu número de pedido y el correo usado en la compra.
              </p>

              <form onSubmit={consultarPedido}>
                <div className="mb-3">
                  <label className="form-label">Número de pedido</label>
                  <input
                    type="number"
                    className="form-control"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    placeholder="Ejemplo: 9"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={cargando}
                >
                  {cargando ? "Consultando..." : "Consultar pedido"}
                </button>
              </form>
            </div>
          </div>

          {resultado && (
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="fw-bold mb-1">
                      Pedido #{resultado.pedido.id_pedido}
                    </h3>
                    <p className="text-muted mb-0">
                      {new Date(resultado.pedido.fecha_pedido).toLocaleString()}
                    </p>
                  </div>

                  <span className="badge bg-primary fs-6">
                    {resultado.pedido.estado}
                  </span>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="fw-bold">Cliente</h5>
                    <p className="mb-1">{resultado.pedido.cliente}</p>
                    <p className="text-muted mb-0">{resultado.pedido.correo}</p>
                  </div>

                  <div className="col-md-6">
                    <h5 className="fw-bold">Entrega</h5>
                    <p className="mb-1">{resultado.pedido.metodo_envio}</p>
                    <p className="text-muted mb-0">
                      {resultado.pedido.ciudad}, {resultado.pedido.estado_entrega}
                    </p>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">Productos</h5>

                {resultado.detalles.map((item) => (
                  <div
                    className="d-flex justify-content-between border-bottom py-2"
                    key={item.id_detalle}
                  >
                    <span>
                      {item.producto} x {item.cantidad}
                    </span>

                    <strong>
                      ${Number(item.subtotal).toFixed(2)}
                    </strong>
                  </div>
                ))}

                <div className="mt-4">
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>
                      ${Number(resultado.pedido.subtotal).toFixed(2)}
                    </strong>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <span>Envío</span>
                    <strong>
                      ${Number(resultado.pedido.costo_envio).toFixed(2)}
                    </strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5">
                    <span>Total</span>
                    <strong>
                      ${Number(resultado.pedido.total).toFixed(2)}
                    </strong>
                  </div>

                  <p className="text-muted mt-3 mb-0">
                    Método de pago: {resultado.pedido.metodo_pago}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PublicOrderLookup;