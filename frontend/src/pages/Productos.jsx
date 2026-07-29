import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [estado, setEstado] = useState("Activo");

  const [idEditando, setIdEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const respuestaProductos = await fetch(`${API_URL}/productos`, {
        headers: getAuthHeaders()
      });
        const datosProductos = await respuestaProductos.json();

        const respuestaCategorias = await fetch(`${API_URL}/categorias`, {
          headers: getAuthHeaders()
        });
        const datosCategorias = await respuestaCategorias.json();

        if (activo) {
          setProductos(datosProductos);
          setCategorias(datosCategorias);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/productos`, {
      headers: getAuthHeaders()
      });
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setImagen("");
    setIdCategoria("");
    setEstado("Activo");
    setIdEditando(null);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim() || !precio || !stock || !idCategoria) {
      setMensaje("Nombre, precio, stock y categoría son obligatorios");
      return;
    }

    if (Number(precio) <= 0) {
      setMensaje("El precio debe ser mayor a 0");
      return;
    }

    if (Number(stock) < 0) {
      setMensaje("El stock no puede ser negativo");
      return;
    }

    try {
      const url = idEditando
        ? `${API_URL}/productos/${idEditando}`
        : `${API_URL}/productos`;

      const metodo = idEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          stock,
          imagen,
          id_categoria: idCategoria,
          estado
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "Ocurrió un error");
        return;
      }

      setMensaje(datos.mensaje);
      limpiarFormulario();
      obtenerProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  const editarProducto = (producto) => {
    setIdEditando(producto.id_producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio);
    setStock(producto.stock);
    setImagen(producto.imagen || "");
    setIdCategoria(producto.id_categoria);
    setEstado(producto.estado || "Activo");
    setMensaje("");
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este producto?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo eliminar el producto");
        return;
      }

      setMensaje(datos.mensaje);
      obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="content">
      <h1>Gestión de Productos</h1>
      <p>Administración del catálogo</p>

      <form className="form-card product-form" onSubmit={guardarProducto}>
        <h2>{idEditando ? "Editar producto" : "Nuevo producto"}</h2>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <div className="form-row">
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="URL de imagen opcional"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        <div className="form-row">
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">
            {idEditando ? "Actualizar" : "Guardar"}
          </button>

          {idEditando && (
            <button type="button" className="secondary-button" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
        </div>

        {mensaje && <p className="info-message">{mensaje}</p>}
      </form>

      <section className="table-card products-table">
        <h2>Lista de productos</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${Number(producto.precio).toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>{producto.estado}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar
                  </button>

                  <button
                    className="small-button danger-button"
                    onClick={() => eliminarProducto(producto.id_producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td colSpan="7">No hay productos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Productos;