function PublicLayout({
  children,
  irInicio,
  irLogin,
  irRegistro,
  irMisPedidos,
  irCarrito,
  irConsultarPedido,
  usuario,
  cerrarSesion,
  busqueda = "",
  setBusqueda = () => {},
  cantidadCarrito = 0,
  totalCarrito = 0,
}) {
  return (
    <div className="public-store">
      <div className="top-bar bg-dark text-white text-center py-2">
        Diseño e impresión para pequeños mundos
      </div>

      <header className="container py-4">
        <div className="row align-items-center g-3">
          <div className="col-md-3">
            <h1 className="fw-bold mb-0">TyrForge</h1>
            <small className="text-muted">Ideas forjadas capa por capa</small>
          </div>

          <div className="col-md-5">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar en catálogo"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-primary" type="button">
                Buscar
              </button>
            </div>
          </div>

          <div className="col-md-4 text-md-end">
            {usuario ? (
              <>
                <span className="me-2">
                  Bienvenido, <strong>{usuario.nombre}</strong>
                </span>

                <button
                  className="btn btn-outline-primary me-2"
                  onClick={irMisPedidos}
                >
                  Mis pedidos
                </button>

                <button
                  className="btn btn-outline-danger me-2"
                  onClick={cerrarSesion}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-link text-decoration-none me-2"
                  onClick={irLogin}
                >
                  Iniciar sesión
                </button>

                <button
                  className="btn btn-outline-primary me-2"
                  onClick={irRegistro}
                >
                  Crear cuenta
                </button>
              </>
            )}

            <button className="btn btn-primary" onClick={irCarrito}>
              Carrito: {cantidadCarrito} producto(s) - $
              {totalCarrito.toFixed(2)}
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-dark">
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={irInicio}
              >
                Inicio
              </button>
            </li>

            <button
              className="nav-link text-white btn btn-link"
              onClick={irConsultarPedido}
            >
              Consultar pedido
            </button>

            <li className="nav-item">
              <button className="nav-link text-white btn btn-link">
                Fantasía
              </button>
            </li>

            <li className="nav-item">
              <button className="nav-link text-white btn btn-link">
                Sci-Fi
              </button>
            </li>

            <li className="nav-item">
              <button className="nav-link text-white btn btn-link">
                Escenografía
              </button>
            </li>

            <li className="nav-item">
              <button className="nav-link text-white btn btn-link">
                Accesorios
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container py-4">{children}</main>
    </div>
  );
}

export default PublicLayout;