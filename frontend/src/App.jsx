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
import PublicHome from "./pages/PublicHome";
import PublicLayout from "./components/PublicLayout";
import "./styles.css";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [paginaActual, setPaginaActual] = useState("inicio");
  const [authPage, setAuthPage] = useState("public");

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("carrito");
    setUsuario(null);
    setPaginaActual("inicio");
    setAuthPage("public");
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
    if (paginaActual === "usuarios")
      return <Usuarios usuarioActual={usuario} />;
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
    if (authPage === "login") {
      return (
        <PublicLayout
          irInicio={() => setAuthPage("public")}
          irLogin={() => setAuthPage("login")}
          irRegistro={() => setAuthPage("register")}
        >
          <section className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Iniciar sesión</h2>

                  <Login
                    onLogin={setUsuario}
                    onShowRegister={() => setAuthPage("register")}
                  />

                  <div className="text-center mt-3">
                    <button
                      className="btn btn-link"
                      onClick={() => setAuthPage("public")}
                    >
                      Volver a la tienda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </PublicLayout>
      );
    }

    if (authPage === "register") {
      return (
        <PublicLayout
          irInicio={() => setAuthPage("public")}
          irLogin={() => setAuthPage("login")}
          irRegistro={() => setAuthPage("register")}
        >
          <section className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Crear cuenta</h2>

                  <Register onShowLogin={() => setAuthPage("login")} />

                  <div className="text-center mt-3">
                    <button
                      className="btn btn-link"
                      onClick={() => setAuthPage("public")}
                    >
                      Volver a la tienda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </PublicLayout>
      );
    }
    return (
      <PublicHome
        irLogin={() => setAuthPage("login")}
        irRegistro={() => setAuthPage("register")}
      />
    );
  }

    if (esCliente) {
      return (
        <PublicHome
          irLogin={() => setAuthPage("login")}
          irRegistro={() => setAuthPage("register")}
          irMisPedidos={() => setPaginaActual("mis-pedidos")}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
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