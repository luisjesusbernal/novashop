import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function ClienteHome({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarCatalogo() {
      try {
        const respuesta = await fetch(`${API_URL}/catalogo`, {
          headers: getAuthHeaders()
        });

        const datos = await respuesta.json();

        if (activo) {
          setProductos(datos);
          setCargando(false);
        }
      } catch (error) {
        console.error("Error al cargar catálogo:", error);

        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarCatalogo();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setMensaje("");

    const productoExistente = carrito.find(
      (item) => item.id_producto === producto.id_producto
    );

    if (productoExistente) {
      if (productoExistente.cantidad >= producto.stock) {
        setMensaje("No hay más stock disponible de este producto");
        return;
      }

      const nuevoCarrito = carrito.map((item) =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );

      setCarrito(nuevoCarrito);
      setMensaje("Producto agregado al carrito");
      return;
    }

    setCarrito([
      ...carrito,
      {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        cantidad: 1
      }
    ]);

    setMensaje("Producto agregado al carrito");
  };

  const quitarDelCarrito = (idProducto) => {
    const nuevoCarrito = carrito.filter(
      (item) => item.id_producto !== idProducto
    );

    setCarrito(nuevoCarrito);
    setMensaje("Producto eliminado del carrito");
  };

  const aumentarCantidad = (idProducto) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id_producto === idProducto) {
        if (item.cantidad >= item.stock) {
          setMensaje("No hay más stock disponible de este producto");
          return item;
        }

        return {
          ...item,
          cantidad: item.cantidad + 1
        };
      }

      return item;
    });

    setCarrito(nuevoCarrito);
  };

  const disminuirCantidad = (idProducto) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id_producto === idProducto && item.cantidad > 1) {
        return {
          ...item,
          cantidad: item.cantidad - 1
        };
      }

      return item;
    });

    setCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setMensaje("Carrito vacío");
  };

  const totalCarrito = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const finalizarPedido = async () => {
  if (carrito.length === 0) {
    setMensaje("El carrito está vacío");
    return;
  }

  try {
    const productosPedido = carrito.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad
    }));

    const respuesta = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productos: productosPedido
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(datos.mensaje || "No se pudo crear el pedido");
      return;
    }

    setMensaje(
      `Pedido creado correctamente. Folio: ${datos.id_pedido}. Total: $${Number(
        datos.total
      ).toFixed(2)}`
    );

    setCarrito([]);
  } catch (error) {
    console.error("Error al finalizar pedido:", error);
    setMensaje("No se pudo conectar con el servidor");
  }
};

  const obtenerIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((palabra) => palabra[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (cargando) {
    return (
      <main className="content">
        <h1>Cargando catálogo...</h1>
      </main>
    );
  }

  return (
    <main className="content cliente-content">
      <section className="cliente-hero">
        <div>
          <h1>Catálogo de Productos</h1>
          <p>
            Bienvenido, {usuario.nombre}. Explora los productos disponibles en
            NovaShop.
          </p>
        </div>

        <div className="cliente-badge">
          <span>{carrito.length}</span>
          <p>productos en carrito</p>
        </div>
      </section>

      {mensaje && <p className="info-message cliente-message">{mensaje}</p>}

      <div className="cliente-layout">
        <section className="catalog-section">
          <div className="section-title">
            <h2>Productos disponibles</h2>
            <p>{productos.length} productos encontrados</p>
          </div>

          <div className="product-grid">
            {productos.map((producto) => (
              <div className="product-card" key={producto.id_producto}>
                <div className="product-image">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} />
                  ) : (
                    <span>{obtenerIniciales(producto.nombre)}</span>
                  )}
                </div>

                <div className="product-info">
                  <span className="category-pill">{producto.categoria}</span>

                  <h3>{producto.nombre}</h3>

                  <p className="product-description">{producto.descripcion}</p>

                  <div className="product-details">
                    <p>
                      <strong>Stock:</strong> {producto.stock}
                    </p>
                    <p className="product-price">
                      ${Number(producto.precio).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button onClick={() => agregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
              </div>
            ))}

            {productos.length === 0 && (
              <p>No hay productos disponibles en este momento.</p>
            )}
          </div>
        </section>

        <aside className="cart-card">
          <h2>Carrito</h2>

          {carrito.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío.</p>
              <span>Agrega productos para comenzar tu pedido.</span>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {carrito.map((item) => (
                  <div className="cart-item" key={item.id_producto}>
                    <div>
                      <h4>{item.nombre}</h4>
                      <p>${Number(item.precio).toFixed(2)} c/u</p>
                    </div>

                    <div className="cart-controls">
                      <button onClick={() => disminuirCantidad(item.id_producto)}>
                        -
                      </button>

                      <span>{item.cantidad}</span>

                      <button onClick={() => aumentarCantidad(item.id_producto)}>
                        +
                      </button>
                    </div>

                    <p className="cart-subtotal">
                      Subtotal: $
                      {(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>

                    <button
                      className="small-button danger-button"
                      onClick={() => quitarDelCarrito(item.id_producto)}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Total</span>
                <strong>${totalCarrito.toFixed(2)}</strong>
              </div>

              <button onClick={finalizarPedido}>Finalizar pedido</button>

              <button className="secondary-button" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

export default ClienteHome;