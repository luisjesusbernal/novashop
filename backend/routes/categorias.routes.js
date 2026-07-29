const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const [categorias] = await db.query(
      "SELECT * FROM categorias ORDER BY id_categoria DESC"
    );

    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    res.status(500).json({
      mensaje: "Error al obtener categorías",
      error: error.message
    });
  }
});

// Obtener una categoría por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [categorias] = await db.query(
      "SELECT * FROM categorias WHERE id_categoria = ?",
      [id]
    );

    if (categorias.length === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    res.json(categorias[0]);
  } catch (error) {
    console.error("Error al obtener categoría:", error);

    res.status(500).json({
      mensaje: "Error al obtener categoría",
      error: error.message
    });
  }
});

// Crear categoría
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El nombre de la categoría es obligatorio"
      });
    }

    const [resultado] = await db.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion || ""]
    );

    res.status(201).json({
      mensaje: "Categoría creada correctamente",
      id_categoria: resultado.insertId
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);

    res.status(500).json({
      mensaje: "Error al crear categoría",
      error: error.message
    });
  }
});

// Actualizar categoría
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El nombre de la categoría es obligatorio"
      });
    }

    const [resultado] = await db.query(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
      [nombre, descripcion || "", id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    res.json({
      mensaje: "Categoría actualizada correctamente"
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    res.status(500).json({
      mensaje: "Error al actualizar categoría",
      error: error.message
    });
  }
});

// Eliminar categoría
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    res.json({
      mensaje: "Categoría eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);

    res.status(500).json({
      mensaje: "Error al eliminar categoría",
      error: error.message
    });
  }
});

module.exports = router;