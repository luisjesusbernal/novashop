import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditando, setIdEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarCategorias() {
      try {
        const respuesta = await fetch(`${API_URL}/categorias`, {
        headers: getAuthHeaders()
      });
        const datos = await respuesta.json();

        if (activo) {
          setCategorias(datos);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    }

    cargarCategorias();

    return () => {
      activo = false;
    };
  }, []);

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/categorias`, {
        headers: getAuthHeaders()
      });
      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setIdEditando(null);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim()) {
      setMensaje("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const url = idEditando
        ? `${API_URL}/categorias/${idEditando}`
        : `${API_URL}/categorias`;

      const metodo = idEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
      method: metodo,
      headers: getAuthHeaders(),
      body: JSON.stringify({
      nombre,
      descripcion
      })
    });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "Ocurrió un error");
        return;
      }

      setMensaje(datos.mensaje);
      limpiarFormulario();
      obtenerCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  const editarCategoria = (categoria) => {
    setIdEditando(categoria.id_categoria);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion || "");
    setMensaje("");
  };

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta categoría?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/categorias/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo eliminar la categoría");
        return;
      }

      setMensaje(datos.mensaje);
      obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="content">
      <h1>Gestión de Categorías</h1>
      <p>Administración de categorías de productos</p>

      <form className="form-card" onSubmit={guardarCategoria}>
        <h2>{idEditando ? "Editar categoría" : "Nueva categoría"}</h2>

        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

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

      <section className="table-card">
        <h2>Lista de categorías</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.id_categoria}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => editarCategoria(categoria)}
                  >
                    Editar
                  </button>

                  <button
                    className="small-button danger-button"
                    onClick={() => eliminarCategoria(categoria.id_categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {categorias.length === 0 && (
              <tr>
                <td colSpan="4">No hay categorías registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Categorias;