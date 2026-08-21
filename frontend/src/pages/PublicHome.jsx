import { useEffect, useState } from "react";
import API_URL from "../services/api";
import PublicLayout from "../components/PublicLayout";

function PublicHome({
  irInicio,
  irLogin,
  irRegistro,
  irMisPedidos,
  irCarrito,
  irConsultarPedido,
  irProducto,
  usuario,
  cerrarSesion,
  carrito,
  setCarrito,
}) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [productoAgregado, setProductoAgregado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        const respuesta = await fetch(`${API_URL}/catalogo`);
        const datos = await respuesta.json();

        if (activo) {
          if (!respuesta.ok) {
            setMensaje(datos.mensaje || "No se pudieron cargar los productos");
            setProductos([]);
          } else {
            setProductos(datos);
          }

          setCargando(false);
        }
      } catch (error) {
        console.error("Error al cargar catálogo:", error);

        if (activo) {
          setMensaje("No se pudo conectar con el servidor");
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  const normalizarTexto = (texto = "") => {
    return texto
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const categorias = [
    "Todos",
    ...new Set(productos.map((producto) => producto.categoria).filter(Boolean)),
  ];

  const productosFiltrados = productos.filter((producto) => {
    const textoProducto = normalizarTexto(
      `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
    );

    const textoBusqueda = normalizarTexto(busqueda);

    const coincideBusqueda = textoProducto.includes(textoBusqueda);

    const coincideCategoria =
      categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

    return coincideBusqueda && coincideCategoria;
  });

  const catalogoActivo = busqueda.trim() !== "" || categoriaActiva !== "Todos";

  const totalCarrito = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(
      (item) => item.id_producto === producto.id_producto
    );

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

    setProductoAgregado(producto);
  };

  return (
    <PublicLayout
      irInicio={irInicio}
      irLogin={irLogin}
      irRegistro={irRegistro}
      irMisPedidos={irMisPedidos}
      irCarrito={irCarrito}
      irConsultarPedido={irConsultarPedido}
      usuario={usuario}
      cerrarSesion={cerrarSesion}
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      mostrarBuscador={true}
      cantidadCarrito={cantidadCarrito}
      totalCarrito={totalCarrito}
    >
      {!catalogoActivo && (
        <section className="tf-hero">
          <div>
            <span className="tf-eyebrow">TyrForge 3D</span>

            <h1>Diseño e impresión para pequeños mundos.</h1>

            <p>
              Modelos, accesorios y piezas impresas en 3D para coleccionistas,
              terrarios, escenografía y mundos en miniatura.
            </p>

            <div className="tf-hero-actions">
              <button
                className="tf-primary-button"
                onClick={() => {
                  document
                    .getElementById("tf-catalogo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explorar modelos
              </button>

              <button
                className="tf-secondary-button"
                onClick={irConsultarPedido}
              >
                Consultar pedido
              </button>
            </div>
          </div>

          <div className="tf-hero-card">
            <div className="tf-model-preview">
              <span>TF</span>
            </div>

            <div>
              <strong>Modelos listos para imprimir</strong>
              <p>Catálogo inicial en expansión.</p>
            </div>
          </div>
        </section>
      )}

      {!catalogoActivo && (
        <section className="tf-feature-row">
          <article>
            <span>⬡</span>
            <div>
              <strong>Impresión 3D</strong>
              <p>Piezas funcionales y decorativas.</p>
            </div>
          </article>

          <article>
            <span>◇</span>
            <div>
              <strong>Detalle</strong>
              <p>Diseños para pequeños mundos.</p>
            </div>
          </article>

          <article>
            <span>▣</span>
            <div>
              <strong>Envíos</strong>
              <p>Opciones locales y nacionales.</p>
            </div>
          </article>
        </section>
      )}
      <section className="tf-catalog-layout" id="tf-catalogo">
        <aside className="tf-category-panel">
          <h2>Categorías</h2>

          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={categoriaActiva === categoria ? "active" : ""}
              onClick={() => setCategoriaActiva(categoria)}
            >
              {categoria === "Todos" ? "Todos los productos" : categoria}
            </button>
          ))}
        </aside>

        <div className="tf-catalog-content">
          <div className="tf-section-heading">
            <div>
              <span className="tf-eyebrow">Catálogo</span>
              <h2>Productos disponibles</h2>
            </div>

            <p>{productosFiltrados.length} producto(s)</p>
          </div>

          {mensaje && <div className="alert alert-warning">{mensaje}</div>}

          {cargando ? (
            <div className="tf-empty-state">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="tf-empty-state">
              No encontramos productos con esa búsqueda.
            </div>
          ) : (
            <div className="tf-product-grid">
              {productosFiltrados.map((producto) => (
                <article className="tf-product-card" key={producto.id_producto}>
                  <button
                    className="tf-product-image"
                    onClick={() => irProducto(producto)}
                  >
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} />
                    ) : (
                      <span>{producto.nombre.charAt(0)}</span>
                    )}
                  </button>

                  <div className="tf-product-info">
                    <span className="tf-category-badge">
                      {producto.categoria || "Sin categoría"}
                    </span>

                    <h3 onClick={() => irProducto(producto)}>
                      {producto.nombre}
                    </h3>

                    <p>{producto.descripcion}</p>

                    <strong className="tf-product-price">
                      ${Number(producto.precio).toFixed(2)}
                    </strong>

                    <div className="tf-product-actions">
                      <button
                        className="tf-secondary-button"
                        onClick={() => irProducto(producto)}
                      >
                        Ver detalles
                      </button>

                      <button
                        className="tf-icon-button"
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {productoAgregado && (
        <div className="modal fade show d-block tf-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content tf-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto añadido correctamente</h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setProductoAgregado(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row align-items-center g-4">
                  <div className="col-md-4">
                    <div className="tf-modal-product-image">
                      {productoAgregado.imagen ? (
                        <img
                          src={productoAgregado.imagen}
                          alt={productoAgregado.nombre}
                        />
                      ) : (
                        <span>{productoAgregado.nombre.charAt(0)}</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <h5>{productoAgregado.nombre}</h5>
                    <p className="mb-1">
                      ${Number(productoAgregado.precio).toFixed(2)}
                    </p>
                    <p className="text-muted mb-0">Cantidad agregada: 1</p>
                  </div>

                  <div className="col-md-4">
                    <h5>Tu carrito</h5>
                    <p className="mb-1">Productos: {cantidadCarrito}</p>
                    <p className="mb-3">Total: ${totalCarrito.toFixed(2)}</p>

                    <button
                      className="tf-secondary-button w-100 mb-2"
                      onClick={() => setProductoAgregado(null)}
                    >
                      Continuar comprando
                    </button>

                    <button
                      className="tf-primary-button w-100"
                      onClick={() => {
                        setProductoAgregado(null);
                        irCarrito();
                      }}
                    >
                      Ir al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

export default PublicHome;