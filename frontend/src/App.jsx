import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import PublicCart from "./pages/PublicCart";
import PublicCheckout from "./pages/PublicCheckout";
import PublicOrderLookup from "./pages/PublicOrderLookup";
import PublicProductDetail from "./pages/PublicProductDetail";
import "./styles.css";

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [paginaActual, setPaginaActual] = useState("inicio");
  const [authPage, setAuthPage] = useState("public");

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

 useEffect(() => {
  const ruta = location.pathname;

  const sincronizarRuta = () => {
    const esRutaAdmin = ruta.startsWith("/admin");
    const esRutaCliente = ruta === "/mis-pedidos";
    const esRutaAuth = ruta === "/login" || ruta === "/registro";

    if (esRutaAdmin && !usuario) {
      setPaginaActual("inicio");
      setAuthPage("login");
      setProductoSeleccionado(null);
      navigate("/login", { replace: true });
      return;
    }

    if (esRutaAdmin && usuario?.id_rol !== 1) {
      setPaginaActual("inicio");
      setAuthPage("public");
      setProductoSeleccionado(null);
      navigate("/", { replace: true });
      return;
    }

    if (esRutaCliente && !usuario) {
      setPaginaActual("inicio");
      setAuthPage("login");
      setProductoSeleccionado(null);
      navigate("/login", { replace: true });
      return;
    }

    if (esRutaCliente && usuario?.id_rol !== 2) {
      setPaginaActual("inicio");
      setAuthPage("public");
      setProductoSeleccionado(null);
      navigate("/admin", { replace: true });
      return;
    }

    if (esRutaAuth && usuario?.id_rol === 1) {
      setPaginaActual("inicio");
      setAuthPage("public");
      setProductoSeleccionado(null);
      navigate("/admin", { replace: true });
      return;
    }

    if (esRutaAuth && usuario?.id_rol === 2) {
      setPaginaActual("inicio");
      setAuthPage("public");
      setProductoSeleccionado(null);
      navigate("/", { replace: true });
      return;
    }

    switch (ruta) {
      case "/":
        setPaginaActual("inicio");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/login":
        setPaginaActual("inicio");
        setAuthPage("login");
        setProductoSeleccionado(null);
        break;

      case "/registro":
        setPaginaActual("inicio");
        setAuthPage("register");
        setProductoSeleccionado(null);
        break;

      case "/carrito":
        setPaginaActual("carrito");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/checkout":
        setPaginaActual("checkout");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/consultar-pedido":
        setPaginaActual("consulta-pedido");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/producto":
        setPaginaActual("producto");
        setAuthPage("public");
        break;

      case "/mis-pedidos":
        setPaginaActual("mis-pedidos");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin":
        setPaginaActual("inicio");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin/productos":
        setPaginaActual("productos");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin/categorias":
        setPaginaActual("categorias");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin/usuarios":
        setPaginaActual("usuarios");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin/reportes":
        setPaginaActual("reportes");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      case "/admin/pedidos":
        setPaginaActual("pedidos");
        setAuthPage("public");
        setProductoSeleccionado(null);
        break;

      default:
        setPaginaActual("inicio");
        setAuthPage("public");
        setProductoSeleccionado(null);
        navigate("/", { replace: true });
        break;
    }
  };

  const id = setTimeout(sincronizarRuta, 0);

  return () => clearTimeout(id);
}, [location.pathname, usuario, navigate]);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  setUsuario(null);
  setPaginaActual("inicio");
  setAuthPage("public");
  setProductoSeleccionado(null);
  navigate("/", { replace: true });
};

  const esAdmin = usuario?.id_rol === 1;
  const esCliente = usuario?.id_rol === 2;

  const totalCarrito = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const volverATienda = () => {
  setPaginaActual("inicio");
  setAuthPage("public");
  setProductoSeleccionado(null);
  navigate("/");
};

const abrirLogin = () => {
  setPaginaActual("inicio");
  setAuthPage("login");
  navigate("/login");
};

const abrirRegistro = () => {
  setPaginaActual("inicio");
  setAuthPage("register");
  navigate("/registro");
};

  const abrirCarrito = () => {
  setPaginaActual("carrito");
  setAuthPage("public");
  navigate("/carrito");
};

const abrirCheckout = () => {
  setPaginaActual("checkout");
  setAuthPage("public");
  navigate("/checkout");
};

const abrirConsultaPedido = () => {
  setPaginaActual("consulta-pedido");
  setAuthPage("public");
  navigate("/consultar-pedido");
};

const abrirMisPedidos = () => {
  setPaginaActual("mis-pedidos");
  setAuthPage("public");
  navigate("/mis-pedidos");
};

const abrirProducto = (producto) => {
  setProductoSeleccionado(producto);
  setPaginaActual("producto");
  setAuthPage("public");
  navigate("/producto");
};

const manejarLogin = (usuarioLogin) => {
  setUsuario(usuarioLogin);
  setAuthPage("public");
  setProductoSeleccionado(null);

  if (usuarioLogin.id_rol === 1) {
    setPaginaActual("inicio");
    navigate("/admin", { replace: true });
  } else {
    setPaginaActual("inicio");
    navigate("/", { replace: true });
  }
};

const abrirAdminPagina = (clave) => {
  const rutasAdmin = {
    inicio: "/admin",
    productos: "/admin/productos",
    categorias: "/admin/categorias",
    usuarios: "/admin/usuarios",
    reportes: "/admin/reportes",
    pedidos: "/admin/pedidos",
  };

  setPaginaActual(clave);
  setAuthPage("public");
  setProductoSeleccionado(null);
  navigate(rutasAdmin[clave] || "/admin");
};


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
      onClick={() => abrirAdminPagina(clave)}
    >
      {texto}
    </button>
  );

  if (!usuario) {
    if (authPage === "login") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <section className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Iniciar sesión</h2>

                  <Login
                    onLogin={manejarLogin}
                    onShowRegister={abrirRegistro}
                  />

                  <div className="text-center mt-3">
                    <button className="btn btn-link" onClick={volverATienda}>
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
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <section className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Crear cuenta</h2>

                  <Register onShowLogin={abrirLogin} />

                  <div className="text-center mt-3">
                    <button className="btn btn-link" onClick={volverATienda}>
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

    if (paginaActual === "carrito") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicCart
            carrito={carrito}
            setCarrito={setCarrito}
            irInicio={() => setPaginaActual("inicio")}
            irCheckout={abrirCheckout}
          />
        </PublicLayout>
      );
    }

    if (paginaActual === "checkout") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicCheckout
            carrito={carrito}
            usuario={usuario}
            setCarrito={setCarrito}
            irInicio={() => setPaginaActual("inicio")}
            irLogin={abrirLogin}
            irConsultarPedido={abrirConsultaPedido}
          />
        </PublicLayout>
      );
    }

    if (paginaActual === "consulta-pedido") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicOrderLookup />
        </PublicLayout>
      );
    }

    if (paginaActual === "producto") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicProductDetail
            producto={productoSeleccionado}
            carrito={carrito}
            setCarrito={setCarrito}
            irInicio={() => setPaginaActual("inicio")}
            irCarrito={abrirCarrito}
          />
        </PublicLayout>
      );
    }

    return (
      <PublicHome
        irInicio={() => setPaginaActual("inicio")}
        irLogin={abrirLogin}
        irRegistro={abrirRegistro}
        irCarrito={abrirCarrito}
        irConsultarPedido={abrirConsultaPedido}
        irProducto={abrirProducto}
        carrito={carrito}
        setCarrito={setCarrito}
      />
    );
  }

  if (esCliente) {
    if (paginaActual === "carrito") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irMisPedidos={abrirMisPedidos}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicCart
            carrito={carrito}
            setCarrito={setCarrito}
            irInicio={() => setPaginaActual("inicio")}
            irCheckout={abrirCheckout}
          />
        </PublicLayout>
      );
    }

    if (paginaActual === "checkout") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irMisPedidos={abrirMisPedidos}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicCheckout
            carrito={carrito}
            usuario={usuario}
            setCarrito={setCarrito}
            irInicio={() => setPaginaActual("inicio")}
            irLogin={abrirLogin}
            irConsultarPedido={abrirConsultaPedido}
          />
        </PublicLayout>
      );
    }

    if (paginaActual === "mis-pedidos") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irMisPedidos={abrirMisPedidos}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <MisPedidos />
        </PublicLayout>
      );
    }

    if (paginaActual === "consulta-pedido") {
      return (
        <PublicLayout
          irInicio={() => setPaginaActual("inicio")}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irMisPedidos={abrirMisPedidos}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicOrderLookup />
        </PublicLayout>
      );
    }

    if (paginaActual === "producto") {
      return (
        <PublicLayout
          irInicio={() => {
            setPaginaActual("inicio");
            setProductoSeleccionado(null);
          }}
          irLogin={abrirLogin}
          irRegistro={abrirRegistro}
          irMisPedidos={abrirMisPedidos}
          irCarrito={abrirCarrito}
          irConsultarPedido={abrirConsultaPedido}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
          totalCarrito={totalCarrito}
        >
          <PublicProductDetail
            producto={productoSeleccionado}
            carrito={carrito}
            setCarrito={setCarrito}
            irInicio={() => {
              setPaginaActual("inicio");
              setProductoSeleccionado(null);
            }}
            irCarrito={abrirCarrito}
          />
        </PublicLayout>
      );
    }
    return (
      <PublicHome
        irInicio={() => setPaginaActual("inicio")}
        irLogin={abrirLogin}
        irRegistro={abrirRegistro}
        irMisPedidos={abrirMisPedidos}
        irCarrito={abrirCarrito}
        irConsultarPedido={abrirConsultaPedido}
        irProducto={abrirProducto}
        usuario={usuario}
        cerrarSesion={cerrarSesion}
        carrito={carrito}
        setCarrito={setCarrito}
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