import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Usuarios from "./pages/Usuarios";
import Reportes from "./pages/Reportes";
import ClienteHome from "./pages/ClienteHome";
import Pedidos from "./pages/Pedidos";
import MisPedidos from "./pages/MisPedidos";
import Register from "./pages/Register";
import "./styles.css";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [paginaActual, setPaginaActual] = useState("inicio");
  const [authPage, setAuthPage] = useState("login");

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("carrito");
    setUsuario(null);
    setPaginaActual("inicio");
  };

  const esAdmin = usuario?.id_rol === 1;
  const esCliente = usuario?.id_rol === 2;

  const renderizarPagina = () => {
    if (esCliente) {
      if (paginaActual === "mis-pedidos") return <MisPedidos />;
      return <ClienteHome usuario={usuario} />;
    }

    if (paginaActual === "productos") return <Productos />;
    if (paginaActual === "categorias") return <Categorias />;
    if (paginaActual === "usuarios") return <Usuarios usuarioActual={usuario} />;
    if (paginaActual === "reportes") return <Reportes />;
    if (paginaActual === "pedidos") return <Pedidos />;

    return <Dashboard />;
  };

  const botonMenu = (clave, texto) => (
    <button
      className={`menu-button ${paginaActual === clave ? "active" : ""}`}
      onClick={() => setPaginaActual(clave)}
    >
      {texto}
    </button>
  );

  if (!usuario) {
  if (authPage === "register") {
    return <Register onShowLogin={() => setAuthPage("login")} />;
  }

  return (
    <Login
      onLogin={setUsuario}
      onShowRegister={() => setAuthPage("register")}
    />
  );
}

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo small">
          NOVA
          <br />
          Shop
        </div>

        <h3>{esAdmin ? "Menú principal" : "Menú cliente"}</h3>

        <nav>
          {esAdmin ? (
            <>
              {botonMenu("inicio", "Inicio")}
              {botonMenu("productos", "Productos")}
              {botonMenu("categorias", "Categorías")}
              {botonMenu("usuarios", "Usuarios")}
              {botonMenu("reportes", "Reportes")}
              {botonMenu("pedidos", "Pedidos")}
            </>
          ) : (
            <>
              {botonMenu("inicio", "Catálogo")}
              {botonMenu("mis-pedidos", "Mis pedidos")}
            </>
          )}
        </nav>
      </aside>

      <div className="page-area">
        <header className="top-header">
          <div>
            <h2>{esAdmin ? "NovaShop Admin" : "NovaShop Cliente"}</h2>
            <p>
              {esAdmin
                ? "Sistema web de tienda en línea"
                : "Catálogo y carrito de compras"}
            </p>
          </div>

          <div className="admin-info">
            <span>
              {usuario.rol}: {usuario.nombre}
            </span>
            <button onClick={cerrarSesion}>Salir</button>
          </div>
        </header>

        <section className="page-content">{renderizarPagina()}</section>
      </div>
    </div>
  );
}

export default App;
