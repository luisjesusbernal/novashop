const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [productos] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.estado,
        p.id_categoria,
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto DESC
    `);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);

    res.status(500).json({
      mensaje: "Error al obtener productos",
      error: error.message
    });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [productos] = await db.query(
      `
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.estado,
        p.id_categoria,
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?
      `,
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);

    res.status(500).json({
      mensaje: "Error al obtener producto",
      error: error.message
    });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      id_categoria,
      estado
    } = req.body;

    if (!nombre || !precio || stock === undefined || !id_categoria) {
      return res.status(400).json({
        mensaje: "Nombre, precio, stock y categoría son obligatorios"
      });
    }

    if (Number(precio) <= 0) {
      return res.status(400).json({
        mensaje: "El precio debe ser mayor a 0"
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        mensaje: "El stock no puede ser negativo"
      });
    }

    const [resultado] = await db.query(
      `INSERT INTO productos 
      (nombre, descripcion, precio, stock, imagen, id_categoria, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || "",
        precio,
        stock,
        imagen || "",
        id_categoria,
        estado || "Activo"
      ]
    );

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id_producto: resultado.insertId
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    res.status(500).json({
      mensaje: "Error al crear producto",
      error: error.message
    });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      id_categoria,
      estado
    } = req.body;

    if (!nombre || !precio || stock === undefined || !id_categoria) {
      return res.status(400).json({
        mensaje: "Nombre, precio, stock y categoría son obligatorios"
      });
    }

    if (Number(precio) <= 0) {
      return res.status(400).json({
        mensaje: "El precio debe ser mayor a 0"
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        mensaje: "El stock no puede ser negativo"
      });
    }

    const [resultado] = await db.query(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, id_categoria = ?, estado = ?
       WHERE id_producto = ?`,
      [
        nombre,
        descripcion || "",
        precio,
        stock,
        imagen || "",
        id_categoria,
        estado || "Activo",
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente"
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);

    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message
    });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    res.status(500).json({
      mensaje: "Error al eliminar producto",
      error: error.message
    });
  }
});

module.exports = router;