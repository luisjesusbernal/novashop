function NoAutorizado({ usuario, cerrarSesion }) {
  return (
    <main className="content">
      <div className="access-denied-card">
        <h1>Acceso denegado</h1>

        <p>
          Hola, {usuario.nombre}. Tu cuenta tiene rol de <strong>{usuario.rol}</strong>.
        </p>

        <p>
          No tienes permisos para acceder al panel administrativo de NovaShop.
        </p>

        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </main>
  );
}

export default NoAutorizado;