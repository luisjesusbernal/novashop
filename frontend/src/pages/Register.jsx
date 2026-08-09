import { useState } from "react";
import API_URL from "../services/api";

function Register({ onShowLogin }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim() || !correo.trim() || !password) {
      setMensaje("Nombre, correo y contraseña son obligatorios");
      return;
    }

    if (!correo.includes("@")) {
      setMensaje("El correo electrónico no es válido");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          correo,
          password,
          telefono,
          direccion
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo registrar el usuario");
        return;
      }

      setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");

      setNombre("");
      setCorreo("");
      setPassword("");
      setTelefono("");
      setDireccion("");
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        NOVA
        <br />
        Shop
      </div>

      <form className="login-card register-card" onSubmit={registrarUsuario}>
        <h2>Crear cuenta</h2>

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

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <button type="submit">Registrarse</button>

        <button
          type="button"
          className="link-button"
          onClick={onShowLogin}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>

        {mensaje && <p className="info-message">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Register;