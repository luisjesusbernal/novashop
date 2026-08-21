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
  setBusqueda,
  mostrarBuscador = false,
  cantidadCarrito = 0,
  totalCarrito = 0,
}) {
  const manejarBusqueda = (e) => {
    e.preventDefault();
  };

  return (
    <div className="public-shell">
      <div className="tf-topbar">
        <span>Diseño e impresión para pequeños mundos</span>
        <span className="d-none d-md-inline">Ideas forjadas capa por capa</span>
      </div>

      <header className="tf-header">
        <div className="container">
          <div className="tf-header-grid">
            <button className="tf-brand" onClick={irInicio}>
              <span className="tf-brand-mark">ᛏ</span>

              <span>
                <strong>TyrForge</strong>
                <small>Ideas forjadas capa por capa</small>
              </span>
            </button>

            {mostrarBuscador ? (
              <form className="tf-search" onSubmit={manejarBusqueda}>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en catálogo"
                />

                <button type="submit">Buscar</button>
              </form>
            ) : (
              <div className="tf-search-placeholder">
                Modelos, accesorios y piezas para pequeños mundos
              </div>
            )}

            <div className="tf-actions">
              {usuario ? (
                <>
                  <span className="tf-user">
                    Hola, <strong>{usuario.nombre}</strong>
                  </span>

                  {irMisPedidos && (
                    <button className="tf-link-button" onClick={irMisPedidos}>
                      Mis pedidos
                    </button>
                  )}

                  <button className="tf-link-button" onClick={cerrarSesion}>
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <button className="tf-link-button" onClick={irLogin}>
                    Iniciar sesión
                  </button>

                  <button className="tf-outline-button" onClick={irRegistro}>
                    Crear cuenta
                  </button>
                </>
              )}

              <button className="tf-cart-button" onClick={irCarrito}>
                Carrito: {cantidadCarrito} producto(s) - $
                {totalCarrito.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="tf-nav">
        <div className="container">
          <button onClick={irInicio}>Inicio</button>
          <button onClick={irConsultarPedido}>Consultar pedido</button>
          <button>Fantasía</button>
          <button>Sci-Fi</button>
          <button>Escenografía</button>
          <button>Accesorios</button>
        </div>
      </nav>

      <main className="tf-main">
        <div className="container">{children}</div>
      </main>

      {cantidadCarrito > 0 && (
        <button className="tf-floating-cart" onClick={irCarrito}>
          <span>🛒</span>

          <div>
            <strong>{cantidadCarrito} producto(s)</strong>
            <small>${totalCarrito.toFixed(2)}</small>
          </div>
        </button>
      )}
    </div>
  );
}

export default PublicLayout;