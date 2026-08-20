function PublicCart({ carrito, setCarrito, irInicio, irCheckout }) {
  const aumentarCantidad = (idProducto) => {
    const carritoActualizado = carrito.map((item) =>
      item.id_producto === idProducto
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );

    setCarrito(carritoActualizado);
  };

  const disminuirCantidad = (idProducto) => {
    const carritoActualizado = carrito
      .map((item) =>
        item.id_producto === idProducto
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter((item) => item.cantidad > 0);

    setCarrito(carritoActualizado);
  };

  const eliminarProducto = (idProducto) => {
    const carritoActualizado = carrito.filter(
      (item) => item.id_producto !== idProducto
    );

    setCarrito(carritoActualizado);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  if (carrito.length === 0) {
    return (
      <section className="card shadow-sm">
        <div className="card-body text-center p-5">
          <h2 className="fw-bold mb-3">Carrito</h2>
          <p className="text-muted">Tu carrito está vacío.</p>

          <button className="btn btn-primary" onClick={irInicio}>
            Volver al catálogo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="fw-bold mb-4">Carrito de compras</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              {carrito.map((item) => (
                <div
                  className="row align-items-center border-bottom py-3"
                  key={item.id_producto}
                >
                  <div className="col-md-2">
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "90px" }}
                    >
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="img-fluid h-100 object-fit-cover"
                        />
                      ) : (
                        <span className="fw-bold text-primary fs-3">
                          {item.nombre.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <h5 className="mb-1">{item.nombre}</h5>
                    <p className="text-muted mb-1">{item.descripcion}</p>
                    <span className="badge bg-secondary">
                      {item.categoria || "Sin categoría"}
                    </span>
                  </div>

                  <div className="col-md-2">
                    <strong>${Number(item.precio).toFixed(2)}</strong>
                  </div>

                  <div className="col-md-2">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => disminuirCantidad(item.id_producto)}
                      >
                        -
                      </button>

                      <span>{item.cantidad}</span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => aumentarCantidad(item.id_producto)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2 text-md-end">
                    <p className="fw-bold mb-2">
                      ${(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarProducto(item.id_producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-3 d-flex justify-content-between">
                <button className="btn btn-outline-primary" onClick={irInicio}>
                  Seguir comprando
                </button>

                <button
                  className="btn btn-outline-danger"
                  onClick={vaciarCarrito}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Resumen</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Productos</span>
                <strong>{carrito.length}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <strong>${totalCarrito.toFixed(2)}</strong>
              </div>

              <hr />

              <button className="btn btn-success w-100" onClick={irCheckout}>
                Finalizar compra
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PublicCart;