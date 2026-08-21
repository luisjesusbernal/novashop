const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener productos activos para el catálogo del cliente
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
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'Activo' AND p.stock > 0
      ORDER BY p.id_producto DESC
    `);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    res.status(500).json({
      mensaje: "Error al obtener el catálogo"
    });
  }
});

// Obtener un producto público por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      mensaje: "ID de producto no válido",
    });
  }

  try {
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
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?
        AND p.estado = 'Activo'
      `,
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error("Error al obtener producto público:", error);

    res.status(500).json({
      mensaje: "Error al obtener el producto",
    });
  }
});

module.exports = router;