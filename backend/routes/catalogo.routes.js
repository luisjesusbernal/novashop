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

module.exports = router;