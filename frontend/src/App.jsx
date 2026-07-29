import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Usuarios from "./pages/Usuarios";
import Reportes from "./pages/Reportes";
import ClienteHome from "./pages/ClienteHome";
import "./styles.css";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [paginaActual, setPaginaActual] = useState("inicio");

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
      return <ClienteHome usuario={usuario} />;
    }

    if (paginaActual === "productos") return <Productos />;
    if (paginaActual === "categorias") return <Categorias />;
    if (paginaActual === "usuarios") return <Usuarios />;
    if (paginaActual === "reportes") return <Reportes />;

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
    return <Login onLogin={setUsuario} />;
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
            </>
          ) : (
            <button className="menu-button active">Catálogo</button>
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

        <section className="page-content">
          {renderizarPagina()}
        </section>
      </div>
    </div>
  );
}

export default App;