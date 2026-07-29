import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [idRol, setIdRol] = useState("2");

  const [idEditando, setIdEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        const respuesta = await fetch(`${API_URL}/usuarios`, {
        headers: getAuthHeaders()
      });
        const datos = await respuesta.json();

        if (activo) {
          setUsuarios(datos);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    }

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders()
    });
      const datos = await respuesta.json();
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setTelefono("");
    setDireccion("");
    setIdRol("2");
    setIdEditando(null);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim() || !correo.trim() || !idRol) {
      setMensaje("Nombre, correo y rol son obligatorios");
      return;
    }

    if (!correo.includes("@")) {
      setMensaje("El correo electrónico no es válido");
      return;
    }

    if (!idEditando && !password) {
      setMensaje("La contraseña es obligatoria al crear un usuario");
      return;
    }

    if (!idEditando && password.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    try {
      const url = idEditando
        ? `${API_URL}/usuarios/${idEditando}`
        : `${API_URL}/usuarios`;

      const metodo = idEditando ? "PUT" : "POST";

      const body = idEditando
        ? {
            nombre,
            correo,
            telefono,
            direccion,
            id_rol: idRol
          }
        : {
            nombre,
            correo,
            password,
            telefono,
            direccion,
            id_rol: idRol
          };

      const respuesta = await fetch(url, {
        method: metodo,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "Ocurrió un error");
        return;
      }

      setMensaje(datos.mensaje);
      limpiarFormulario();
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  const editarUsuario = (usuario) => {
    setIdEditando(usuario.id_usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setPassword("");
    setTelefono(usuario.telefono || "");
    setDireccion(usuario.direccion || "");
    setIdRol(String(usuario.id_rol));
    setMensaje("");
  };

  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo eliminar el usuario");
        return;
      }

      setMensaje(datos.mensaje);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  const cambiarPassword = async (id) => {
    const nuevaPassword = window.prompt("Escribe la nueva contraseña:");

    if (!nuevaPassword) {
      return;
    }

    if (nuevaPassword.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/${id}/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
      password: nuevaPassword
      })
    });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo cambiar la contraseña");
        return;
      }

      setMensaje(datos.mensaje);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="content">
      <h1>Gestión de Usuarios</h1>
      <p>Administración de usuarios del sistema</p>

      <form className="form-card user-form" onSubmit={guardarUsuario}>
        <h2>{idEditando ? "Editar usuario" : "Nuevo usuario"}</h2>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        {!idEditando && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <div className="form-row">
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <select value={idRol} onChange={(e) => setIdRol(e.target.value)}>
            <option value="1">Administrador</option>
            <option value="2">Cliente</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
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

      <section className="table-card users-table">
        <h2>Lista de usuarios</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.telefono}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => editarUsuario(usuario)}
                  >
                    Editar
                  </button>

                  <button
                    className="small-button"
                    onClick={() => cambiarPassword(usuario.id_usuario)}
                  >
                    Password
                  </button>

                  <button
                    className="small-button danger-button"
                    onClick={() => eliminarUsuario(usuario.id_usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="6">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Usuarios;