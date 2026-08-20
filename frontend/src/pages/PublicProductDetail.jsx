import { useState } from "react";

function PublicProductDetail({
  producto,
  carrito,
  setCarrito,
  irInicio,
  irCarrito,
}) {
  const [cantidad, setCantidad] = useState(1);
  const [codigoPostal, setCodigoPostal] = useState("");
  const [envios, setEnvios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  if (!producto) {
    return (
      <section className="card shadow-sm">
        <div className="card-body text-center p-5">
          <h2 className="fw-bold mb-3">Producto no encontrado</h2>
          <p className="text-muted">
            No se pudo cargar la información del producto.
          </p>

          <button className="btn btn-primary" onClick={irInicio}>
            Volver a la tienda
          </button>
        </div>
      </section>
    );
  }

  const precio = Number(producto.precio || 0);
  const stock = Number(producto.stock || 0);
  const subtotal = precio * cantidad;

  const productoEnCarrito = carrito.find(
    (item) => item.id_producto === producto.id_producto,
  );

  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
  const stockDisponible = Math.max(stock - cantidadEnCarrito, 0);

  const aumentarCantidad = () => {
    if (cantidad < stockDisponible) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    setMensaje("");

    if (stock <= 0) {
      setMensaje("Este producto no tiene stock disponible.");
      return;
    }

    if (stockDisponible <= 0) {
      setMensaje(
        "Ya tienes en el carrito todas las unidades disponibles de este producto.",
      );
      return;
    }

    if (cantidad > stockDisponible) {
      setMensaje(
        `Solo puedes agregar ${stockDisponible} unidad(es) más de este producto.`,
      );
      return;
    }

    if (productoEnCarrito) {
      const carritoActualizado = carrito.map((item) =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item,
      );

      setCarrito(carritoActualizado);
    } else {
      setCarrito([...carrito, { ...producto, cantidad }]);
    }

    setMensaje(
      `${cantidad} unidad(es) de ${producto.nombre} agregada(s) al carrito.`,
    );
  };

  const calcularEnvio = () => {
    setMensaje("");

    if (!codigoPostal || codigoPostal.length < 5) {
      setMensaje("Ingresa un código postal válido.");
      setEnvios([]);
      return;
    }

    if (codigoPostal.startsWith("20")) {
      setEnvios([
        {
          nombre: "Entrega local en Aguascalientes",
          tiempo: "Entrega estimada de 1 a 3 días",
          costo: 0,
        },
        {
          nombre: "Envío estándar",
          tiempo: "Entrega estimada de 3 a 6 días",
          costo: 99,
        },
        {
          nombre: "Envío express",
          tiempo: "Entrega estimada de 1 a 2 días",
          costo: 179,
        },
      ]);
    } else {
      setEnvios([
        {
          nombre: "Envío estándar nacional",
          tiempo: "Entrega estimada de 3 a 7 días",
          costo: 129,
        },
        {
          nombre: "Envío express nacional",
          tiempo: "Entrega estimada de 2 a 4 días",
          costo: 219,
        },
      ]);
    }
  };

  return (
    <section>
      <button className="btn btn-link mb-3" onClick={irInicio}>
        ← Volver al catálogo
      </button>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div
                className="bg-light d-flex align-items-center justify-content-center rounded"
                style={{ minHeight: "420px" }}
              >
                {producto.imagen ? (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="img-fluid rounded"
                    style={{ maxHeight: "420px", objectFit: "contain" }}
                  />
                ) : (
                  <span className="display-1 fw-bold text-primary">
                    {producto.nombre.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <span className="badge bg-secondary mb-3">
                {producto.categoria || "Sin categoría"}
              </span>

              <h1 className="fw-bold mb-3">{producto.nombre}</h1>

              <p className="text-muted">
                {producto.descripcion || "Producto de impresión 3D TyrForge."}
              </p>

              <h2 className="fw-bold mb-1">${precio.toFixed(2)}</h2>

              <p
                className={stockDisponible > 0 ? "text-success" : "text-danger"}
              >
                {stock > 0
                  ? `Stock disponible: ${stockDisponible}`
                  : "Sin stock disponible"}
              </p>

              {cantidadEnCarrito > 0 && (
                <p className="text-muted">
                  Ya tienes {cantidadEnCarrito} unidad(es) de este producto en
                  tu carrito.
                </p>
              )}

              <hr />

              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="fw-bold">Cantidad:</span>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={disminuirCantidad}
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>

                  <span className="fs-5 px-3">{cantidad}</span>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={aumentarCantidad}
                    disabled={cantidad >= stockDisponible}
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="fs-5">
                Subtotal: <strong>${subtotal.toFixed(2)}</strong>
              </p>

              {mensaje && <div className="alert alert-info">{mensaje}</div>}

              <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                <button
                  className="btn btn-success flex-fill"
                  onClick={agregarAlCarrito}
                  disabled={stockDisponible <= 0}
                >
                  {stockDisponible > 0
                    ? "Agregar al carrito"
                    : "Stock en carrito completo"}
                </button>

                <button
                  className="btn btn-outline-primary flex-fill"
                  onClick={irCarrito}
                >
                  Ir al carrito
                </button>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Opciones de envío</h4>

              <p className="text-muted">
                Ingresa tu código postal para ver opciones estimadas de envío.
              </p>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Código postal"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                />

                <button className="btn btn-primary" onClick={calcularEnvio}>
                  Calcular
                </button>
              </div>

              {envios.length > 0 && (
                <div>
                  {envios.map((envio) => (
                    <div
                      className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                      key={envio.nombre}
                    >
                      <div>
                        <strong>{envio.nombre}</strong>
                        <p className="text-muted mb-0">{envio.tiempo}</p>
                      </div>

                      <strong>
                        {envio.costo === 0
                          ? "Gratis"
                          : `$${envio.costo.toFixed(2)}`}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-muted mt-3 mb-0">
                Estas opciones son simuladas por ahora. Más adelante se
                conectarán con una API real de envíos.
              </p>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Métodos de pago</h4>

              <div className="border rounded p-3 mb-2">
                Transferencia bancaria
              </div>

              <div className="border rounded p-3 mb-2">
                Mercado Pago próximamente
              </div>

              <div className="border rounded p-3 mb-2">PayPal próximamente</div>

              <div className="border rounded p-3">
                Tarjeta de crédito o débito próximamente
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicProductDetail;
