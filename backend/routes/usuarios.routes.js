const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [usuarios] = await db.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.direccion,
        u.id_rol,
        r.nombre AS rol,
        u.fecha_registro
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario DESC
    `);

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [usuarios] = await db.query(
      `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.direccion,
        u.id_rol,
        r.nombre AS rol,
        u.fecha_registro
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
      `,
      [id],
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);

    res.status(500).json({
      mensaje: "Error al obtener usuario",
      error: error.message,
    });
  }
});

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, password, telefono, direccion, id_rol } = req.body;

    if (!nombre || !correo || !password || !id_rol) {
      return res.status(400).json({
        mensaje: "Nombre, correo, contraseña y rol son obligatorios",
      });
    }

    if (!correo.includes("@")) {
      return res.status(400).json({
        mensaje: "El correo electrónico no es válido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres",
      });
    }

    const [usuarioExistente] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo],
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await db.query(
      `INSERT INTO usuarios 
      (nombre, correo, password, telefono, direccion, id_rol)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, correo, passwordHash, telefono || "", direccion || "", id_rol],
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id_usuario: resultado.insertId,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    res.status(500).json({
      mensaje: "Error al crear usuario",
      error: error.message,
    });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono, direccion, id_rol } = req.body;

    if (!nombre || !correo || !id_rol) {
      return res.status(400).json({
        mensaje: "Nombre, correo y rol son obligatorios",
      });
    }

    if (!correo.includes("@")) {
      return res.status(400).json({
        mensaje: "El correo electrónico no es válido",
      });
    }

    const [usuarioExistente] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ? AND id_usuario <> ?",
      [correo, id],
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado por otro usuario",
      });
    }

    if (
      Number(id) === req.usuario.id_usuario &&
      Number(id_rol) !== req.usuario.id_rol
    ) {
      return res.status(400).json({
        mensaje: "No puedes cambiar tu propio rol de administrador",
      });
    }

    const [resultado] = await db.query(
      `UPDATE usuarios
       SET nombre = ?, correo = ?, telefono = ?, direccion = ?, id_rol = ?
       WHERE id_usuario = ?`,
      [nombre, correo, telefono || "", direccion || "", id_rol, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message,
    });
  }
});

// Cambiar contraseña de usuario
router.put("/:id/password", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        mensaje: "La nueva contraseña es obligatoria",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await db.query(
      "UPDATE usuarios SET password = ? WHERE id_usuario = ?",
      [passwordHash, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);

    res.status(500).json({
      mensaje: "Error al actualizar contraseña",
      error: error.message,
    });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.usuario.id_usuario) {
      return res.status(400).json({
        mensaje: "No puedes eliminar tu propio usuario",
      });
    }

    const [resultado] = await db.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.message,
    });
  }
});

module.exports = router;
