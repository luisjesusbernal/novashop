import { useState } from "react";
import API_URL from "../services/api";

function PublicCheckout({ carrito, usuario, setCarrito, irInicio, irLogin }) {

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre || "",
    apellidos: "",
    correo: usuario?.correo || "",
    telefono: "",
    direccion: "",
    direccionExtra: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "México",
    metodoEnvio: "estandar",
    metodoPago: "Transferencia bancaria",
    aceptaTerminos: false,
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [pedidoCreado, setPedidoCreado] = useState(null);

  const actualizarDato = (e) => {
  const { name, value, type, checked } = e.target;

    setDatos({
      ...datos,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const subtotal = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const costoEnvio =
    datos.metodoEnvio === "recoger"
      ? 0
      : datos.metodoEnvio === "express"
      ? 179
      : 99;

  const total = subtotal + costoEnvio;

  const finalizarCheckoutReal = async () => {
    setError("");

    if (carrito.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    if (!datos.nombre || !datos.correo || !datos.telefono) {
      setError("Completa los datos personales obligatorios.");
      return;
    }

    if (
      !datos.direccion ||
      !datos.codigoPostal ||
      !datos.ciudad ||
      !datos.estado
    ) {
      setError("Completa los datos de dirección obligatorios.");
      return;
    }

    if (!datos.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    const productosPedido = carrito.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
    }));

    const pedido = {
      productos: productosPedido,
      cliente: {
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono,
      },
      direccion: {
        direccion_entrega: datos.direccion,
        direccion_extra: datos.direccionExtra,
        codigo_postal: datos.codigoPostal,
        ciudad: datos.ciudad,
        estado_entrega: datos.estado,
        pais: datos.pais,
      },
      metodo_pago: datos.metodoPago,
      metodo_envio: datos.metodoEnvio,
    };

    try {
      setCargando(true);

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const respuesta = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers,
        body: JSON.stringify(pedido),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || "Error al crear el pedido");
      }

      setPedidoCreado(data);
      setCarrito([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  if (carrito.length === 0 && !pedidoCreado) {
    return (
      <section className="card shadow-sm">
        <div className="card-body text-center p-5">
          <h2 className="fw-bold mb-3">Checkout</h2>
          <p className="text-muted">No hay productos en el carrito.</p>

          <button className="btn btn-primary" onClick={irInicio}>
            Volver al catálogo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="fw-bold mb-4">Finalizar compra</h2>

      {!usuario && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>
            Puedes comprar como invitado o iniciar sesión para guardar tu
            historial de pedidos.
          </span>

          <button className="btn btn-outline-primary btn-sm" onClick={irLogin}>
            Iniciar sesión
          </button>
        </div>
      )}

      {usuario && (
        <div className="alert alert-success">
          Comprando como cliente registrado: <strong>{usuario.nombre}</strong>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="accordion" id="checkoutAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#datosPersonales"
                >
                  1. Datos personales
                </button>
              </h2>

              <div
                id="datosPersonales"
                className="accordion-collapse collapse show"
                data-bs-parent="#checkoutAccordion"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={datos.nombre}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        value={datos.apellidos}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={datos.correo}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={datos.telefono}
                        onChange={actualizarDato}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#direccionEntrega"
                >
                  2. Dirección de entrega
                </button>
              </h2>

              <div
                id="direccionEntrega"
                className="accordion-collapse collapse"
                data-bs-parent="#checkoutAccordion"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Dirección *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={datos.direccion}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Dirección complementaria
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="direccionExtra"
                        value={datos.direccionExtra}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Código postal *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="codigoPostal"
                        value={datos.codigoPostal}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Ciudad *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ciudad"
                        value={datos.ciudad}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Estado *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="estado"
                        value={datos.estado}
                        onChange={actualizarDato}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">País</label>
                      <select
                        className="form-select"
                        name="pais"
                        value={datos.pais}
                        onChange={actualizarDato}
                      >
                        <option>México</option>
                        <option>Estados Unidos</option>
                        <option>Canadá</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#metodoEnvio"
                >
                  3. Método de envío
                </button>
              </h2>

              <div
                id="metodoEnvio"
                className="accordion-collapse collapse"
                data-bs-parent="#checkoutAccordion"
              >
                <div className="accordion-body">
                  <div className="form-check border rounded p-3 mb-2">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="radio"
                      name="metodoEnvio"
                      value="estandar"
                      checked={datos.metodoEnvio === "estandar"}
                      onChange={actualizarDato}
                    />
                    <label className="form-check-label ms-2">
                      Envío estándar - $99.00
                    </label>
                  </div>

                  <div className="form-check border rounded p-3 mb-2">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="radio"
                      name="metodoEnvio"
                      value="express"
                      checked={datos.metodoEnvio === "express"}
                      onChange={actualizarDato}
                    />
                    <label className="form-check-label ms-2">
                      Envío express - $179.00
                    </label>
                  </div>

                  <div className="form-check border rounded p-3">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="radio"
                      name="metodoEnvio"
                      value="recoger"
                      checked={datos.metodoEnvio === "recoger"}
                      onChange={actualizarDato}
                    />
                    <label className="form-check-label ms-2">
                      Recoger en punto acordado - Gratis
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#metodoPago"
                >
                  4. Método de pago
                </button>
              </h2>

              <div
                id="metodoPago"
                className="accordion-collapse collapse"
                data-bs-parent="#checkoutAccordion"
              >
                <div className="accordion-body">
                  <select
                    className="form-select"
                    name="metodoPago"
                    value={datos.metodoPago}
                    onChange={actualizarDato}
                  >
                    <option>Transferencia bancaria</option>
                    <option>Pago contra entrega</option>
                    <option>Tarjeta simulada</option>
                    <option>PayPal simulado</option>
                  </select>

                  <p className="text-muted mt-2 mb-0">
                    Los métodos de pago siguen siendo simulados por ahora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Resumen del pedido</h4>

              {carrito.map((item) => (
                <div
                  className="d-flex justify-content-between border-bottom py-2"
                  key={item.id_producto}
                >
                  <span>
                    {item.nombre} x {item.cantidad}
                  </span>
                  <strong>
                    ${(Number(item.precio) * item.cantidad).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Envío</span>
                <strong>${costoEnvio.toFixed(2)}</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-5">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={datos.aceptaTerminos}
                  onChange={actualizarDato}
                />
                <label className="form-check-label">
                  Acepto los términos y condiciones.
                </label>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              {pedidoCreado && (
                <div className="alert alert-success mt-3">
                  <h5 className="fw-bold">Pedido creado correctamente</h5>
                  <p className="mb-1">
                    Número de pedido: {pedidoCreado.id_pedido}
                  </p>
                  <p className="mb-1">
                    Total: ${Number(pedidoCreado.total).toFixed(2)}
                  </p>
                  <p className="mb-0">Cliente: {pedidoCreado.tipo_cliente}</p>

                  <p className="mt-2 mb-0">
                    Guarda tu número de pedido y el correo usado en la compra
                    para consultar el estado más adelante.
                  </p>

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={irInicio}
                  >
                    Volver a la tienda
                  </button>
                </div>
              )}
              <button
                className="btn btn-success w-100 mt-4"
                onClick={finalizarCheckoutReal}
                disabled={cargando || pedidoCreado}
              >
                {cargando ? "Procesando pedido..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PublicCheckout;