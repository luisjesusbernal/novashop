const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener resumen general para dashboard
router.get("/resumen", async (req, res) => {
  try {
    const [[usuarios]] = await db.query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );

    const [[productos]] = await db.query(
      "SELECT COUNT(*) AS total FROM productos"
    );

    const [[categorias]] = await db.query(
      "SELECT COUNT(*) AS total FROM categorias"
    );

    const [[stockBajo]] = await db.query(
      "SELECT COUNT(*) AS total FROM productos WHERE stock <= 5"
    );

    const [[pedidos]] = await db.query(
      "SELECT COUNT(*) AS total FROM pedidos"
    );

    const [[ventas]] = await db.query(
      "SELECT IFNULL(SUM(total), 0) AS total FROM pedidos"
    );

    const [[pedidosPendientes]] = await db.query(
      "SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'Pendiente'"
    );

    res.json({
      usuarios: usuarios.total,
      productos: productos.total,
      categorias: categorias.total,
      stock_bajo: stockBajo.total,
      pedidos: pedidos.total,
      ventas_totales: ventas.total,
      pedidos_pendientes: pedidosPendientes.total
    });
  } catch (error) {
    console.error("Error al obtener resumen:", error);

    res.status(500).json({
      mensaje: "Error al obtener resumen del dashboard"
    });
  }
});

// Obtener productos con bajo stock
router.get("/stock-bajo", async (req, res) => {
  try {
    const [productos] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        p.estado,
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.stock <= 5
      ORDER BY p.stock ASC
    `);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);

    res.status(500).json({
      mensaje: "Error al obtener productos con bajo stock",
      error: error.message
    });
  }
});

module.exports = router;