const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verificarToken, soloAdmin } = require("./middlewares/auth.middleware");
require("dotenv").config();

const db = require("./db");
const categoriasRoutes = require("./routes/categorias.routes");
const productosRoutes = require("./routes/productos.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const catalogoRoutes = require("./routes/catalogo.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/categorias", verificarToken, soloAdmin, categoriasRoutes);
app.use("/api/productos", verificarToken, soloAdmin, productosRoutes);
app.use("/api/usuarios", verificarToken, soloAdmin, usuariosRoutes);
app.use("/api/dashboard", verificarToken, soloAdmin, dashboardRoutes);
app.use("/api/catalogo", verificarToken, catalogoRoutes);
app.use("/api/pedidos", verificarToken, pedidosRoutes);

// Ruta de prueba general
app.get("/", (req, res) => {
  res.json({
    mensaje: "API NovaShop funcionando correctamente"
  });
});

// Ruta para probar conexión con MySQL
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS resultado");

    res.json({
      mensaje: "Conexión a MySQL correcta",
      resultado: rows[0].resultado
    });
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);

    res.status(500).json({
      mensaje: "Error al conectar con MySQL",
      error: error.message
    });
  }
});

// Login funcional con bcrypt
app.post("/api/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const [usuarios] = await db.query(
      `SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.password,
        u.id_rol,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = ?`,
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const usuario = usuarios[0];

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

 const token = jwt.sign(
  {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    correo: usuario.correo,
    id_rol: usuario.id_rol,
    rol: usuario.rol
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "2h"
  }
);

res.json({
  mensaje: "Inicio de sesión correcto",
  token,
  usuario: {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    correo: usuario.correo,
    id_rol: usuario.id_rol,
    rol: usuario.rol
  }
});
  } catch (error) {
    console.error("Error en login:", error);

    res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor NovaShop ejecutándose en http://localhost:${PORT}`);
});