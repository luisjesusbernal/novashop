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
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/categorias", verificarToken, soloAdmin, categoriasRoutes);
app.use("/api/productos", verificarToken, soloAdmin, productosRoutes);
app.use("/api/usuarios", verificarToken, soloAdmin, usuariosRoutes);
app.use("/api/dashboard", verificarToken, soloAdmin, dashboardRoutes);
app.use("/api/pedidos", pedidosRoutes);


function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

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

app.post("/api/register", async (req, res) => {
  const { nombre, correo, password, telefono, direccion } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      mensaje: "Nombre, correo y contraseña son obligatorios"
    });
  }

 if (!validarCorreo(correo)) {
  return res.status(400).json({
    mensaje: "El correo electrónico no tiene un formato válido"
  });
}

  if (!validarPassword(password)) {
  return res.status(400).json({
    mensaje:
      "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
  });
}

  try {
    const [usuarioExistente] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO usuarios 
      (nombre, correo, password, telefono, direccion, id_rol) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, correo, passwordHash, telefono || "", direccion || "", 2]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    res.status(500).json({
      mensaje: "Error al registrar usuario"
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
  console.log(`Servidor NovaShop ejecutándose en el puerto ${PORT}`);
});