import { useEffect, useState } from "react";
import API_URL from "../services/api";

function PublicHome({ irLogin, irRegistro }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");

   useEffect(() => {
  let componenteActivo = true;

  async function cargarProductos() {
    try {
      const respuesta = await fetch(`${API_URL}/catalogo`);
      const datos = await respuesta.json();

      if (componenteActivo) {
        setProductos(datos);
      }
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
    }
  }

  cargarProductos();

  return () => {
    componenteActivo = false;
  };
}, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id_producto === producto.id_producto);

    if (existe) {
      const carritoActualizado = carrito.map((item) =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );

      setCarrito(carritoActualizado);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalCarrito = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

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
            <button className="btn btn-link text-decoration-none me-2" onClick={irLogin}>
              Iniciar sesión
            </button>
            <button className="btn btn-outline-primary me-2" onClick={irRegistro}>
              Crear cuenta
            </button>
            <button className="btn btn-primary">
              Carrito: {cantidadCarrito} producto(s) - ${totalCarrito.toFixed(2)}
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-dark">
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Fantasía
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Sci-Fi
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Escenografía
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                Accesorios
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container py-4">
        <section className="p-4 mb-4 bg-light rounded">
          <h2 className="fw-bold">Catálogo de productos</h2>
          <p className="mb-0">
            Explora productos disponibles para impresión 3D, miniaturas, accesorios y
            pequeños mundos personalizados.
          </p>
        </section>

        <div className="row">
          <aside className="col-md-3 mb-4">
            <div className="card">
              <div className="card-header fw-bold">Categorías</div>
              <div className="list-group list-group-flush">
                <button className="list-group-item list-group-item-action">
                  Todos los productos
                </button>
                <button className="list-group-item list-group-item-action">
                  Tecnología
                </button>
                <button className="list-group-item list-group-item-action">
                  Accesorios
                </button>
                <button className="list-group-item list-group-item-action">
                  Fantasía
                </button>
                <button className="list-group-item list-group-item-action">
                  Sci-Fi
                </button>
              </div>
            </div>
          </aside>

          <section className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Productos disponibles</h3>
              <span>{productosFiltrados.length} producto(s)</span>
            </div>

            <div className="row g-4">
              {productosFiltrados.map((producto) => (
                <div className="col-md-4" key={producto.id_producto}>
                  <div className="card h-100 shadow-sm">
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="img-fluid h-100 object-fit-cover"
                        />
                      ) : (
                        <span className="display-5 fw-bold text-primary">
                          {producto.nombre.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="card-body">
                      <span className="badge bg-secondary mb-2">
                        {producto.categoria || "Sin categoría"}
                      </span>
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text text-muted">{producto.descripcion}</p>
                      <p className="fw-bold fs-5">${Number(producto.precio).toFixed(2)}</p>
                    </div>

                    <div className="card-footer bg-white border-0">
                      <button
                        className="btn btn-success w-100"
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PublicHome;