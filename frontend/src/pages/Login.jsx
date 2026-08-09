import { useState } from "react";
import API_URL from "../services/api";

function Login({ onLogin, onShowRegister }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!correo || !password) {
      setMensaje("Correo y contraseña son obligatorios");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(datos.usuario));
      localStorage.setItem("token", datos.token);
      onLogin(datos.usuario);
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        NOVA
        <br />
        Shop
      </div>

      <form className="login-card" onSubmit={iniciarSesion}>
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

        <button type="submit">Iniciar sesión</button>

        <button type="button" className="link-button" onClick={onShowRegister}>
          ¿No tienes cuenta? Regístrate
        </button>

        {mensaje && <p className="error-message">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Login;
