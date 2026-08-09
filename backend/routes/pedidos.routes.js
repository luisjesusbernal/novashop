const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear un pedido desde el carrito del cliente
router.post("/", async (req, res) => {
  const { productos, metodo_pago } = req.body;
  const idUsuario = req.usuario.id_usuario;

  const metodosPermitidos = [
    "Pago contra entrega",
    "Transferencia bancaria",
    "Tarjeta simulada",
  ];

  const metodoPagoFinal = metodo_pago || "Pago contra entrega";

  if (!metodosPermitidos.includes(metodoPagoFinal)) {
    return res.status(400).json({
      mensaje: "Método de pago no válido",
    });
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      mensaje: "El pedido debe incluir al menos un producto",
    });
  }

  const conexion = await db.getConnection();

  try {
    await conexion.beginTransaction();

    let totalPedido = 0;
    const detalles = [];

    for (const item of productos) {
      const { id_producto, cantidad } = item;

      if (!id_producto || !cantidad || cantidad <= 0) {
        await conexion.rollback();
        return res.status(400).json({
          mensaje: "Todos los productos deben tener ID y cantidad válida",
        });
      }

      const [productoEncontrado] = await conexion.query(
        "SELECT id_producto, nombre, precio, stock, estado FROM productos WHERE id_producto = ?",
        [id_producto],
      );

      if (productoEncontrado.length === 0) {
        await conexion.rollback();
        return res.status(404).json({
          mensaje: `El producto con ID ${id_producto} no existe`,
        });
      }

      const producto = productoEncontrado[0];

      if (producto.estado !== "Activo") {
        await conexion.rollback();
        return res.status(400).json({
          mensaje: `El producto ${producto.nombre} no está activo`,
        });
      }

      if (producto.stock < cantidad) {
        await conexion.rollback();
        return res.status(400).json({
          mensaje: `No hay suficiente stock para ${producto.nombre}`,
        });
      }

      const metodosPermitidos = [
        "Pago contra entrega",
        "Transferencia bancaria",
        "Tarjeta simulada",
      ];

      const metodoPagoFinal = metodo_pago || "Pago contra entrega";

      if (!metodosPermitidos.includes(metodoPagoFinal)) {
        return res.status(400).json({
          mensaje: "Método de pago no válido",
        });
      }
      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * cantidad;
      totalPedido += subtotal;

      detalles.push({
        id_producto,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal,
      });
    }

    const [resultadoPedido] = await conexion.query(
      "INSERT INTO pedidos (id_usuario, total, estado, metodo_pago) VALUES (?, ?, ?, ?)",
      [idUsuario, totalPedido, "Pendiente", metodoPagoFinal],
    );

    const idPedido = resultadoPedido.insertId;

    for (const detalle of detalles) {
      await conexion.query(
        `INSERT INTO detalle_pedidos 
        (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [
          idPedido,
          detalle.id_producto,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal,
        ],
      );

      await conexion.query(
        "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
        [detalle.cantidad, detalle.id_producto],
      );
    }

    await conexion.commit();

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      id_pedido: idPedido,
      total: totalPedido,
      metodo_pago: metodoPagoFinal,
    });
  } catch (error) {
    await conexion.rollback();
    console.error("Error al crear pedido:", error);

    res.status(500).json({
      mensaje: "Error al crear el pedido",
    });
  } finally {
    conexion.release();
  }
});

// Obtener pedidos del cliente que inició sesión
router.get("/mis-pedidos", async (req, res) => {
  const idUsuario = req.usuario.id_usuario;

  try {
    const [pedidos] = await db.query(
      `
      SELECT 
        id_pedido,
        fecha_pedido,
        total,
        estado,
        metodo_pago
      FROM pedidos
      WHERE id_usuario = ?
      ORDER BY fecha_pedido DESC
      `,
      [idUsuario],
    );

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos del cliente:", error);

    res.status(500).json({
      mensaje: "Error al obtener los pedidos",
    });
  }
});

// Obtener todos los pedidos, solo administrador
router.get("/", async (req, res) => {
  if (req.usuario.id_rol !== 1) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol de administrador.",
    });
  }

  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.total,
        p.estado,
        p.metodo_pago,
        u.nombre AS cliente,
        u.correo
      FROM pedidos p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      ORDER BY p.fecha_pedido DESC
    `);

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    res.status(500).json({
      mensaje: "Error al obtener los pedidos",
    });
  }
});

// Actualizar estado de un pedido, solo administrador
router.put("/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body || {};

  const estadosPermitidos = [
    "Pendiente",
    "En proceso",
    "Completado",
    "Cancelado",
  ];

  if (req.usuario.id_rol !== 1) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol de administrador.",
    });
  }

  if (!estado || !estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      mensaje: "Estado no válido",
    });
  }

  try {
    const [pedidoEncontrado] = await db.query(
      "SELECT id_pedido FROM pedidos WHERE id_pedido = ?",
      [id],
    );

    if (pedidoEncontrado.length === 0) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    await db.query("UPDATE pedidos SET estado = ? WHERE id_pedido = ?", [
      estado,
      id,
    ]);

    res.json({
      mensaje: "Estado del pedido actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);

    res.status(500).json({
      mensaje: "Error al actualizar el estado del pedido",
    });
  }
});

// Obtener detalle de un pedido
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [pedido] = await db.query(
      `
      SELECT 
        p.id_pedido,
        p.id_usuario,
        p.fecha_pedido,
        p.total,
        p.estado,
        p.metodo_pago,
        u.nombre AS cliente,
        u.correo
      FROM pedidos p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
      `,
      [id],
    );

    if (pedido.length === 0) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    const pedidoEncontrado = pedido[0];

    if (
      req.usuario.id_rol !== 1 &&
      req.usuario.id_usuario !== pedidoEncontrado.id_usuario
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para ver este pedido",
      });
    }

    const [detalles] = await db.query(
      `
      SELECT 
        dp.id_detalle,
        dp.id_producto,
        pr.nombre AS producto,
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal
      FROM detalle_pedidos dp
      INNER JOIN productos pr ON dp.id_producto = pr.id_producto
      WHERE dp.id_pedido = ?
      `,
      [id],
    );

    res.json({
      pedido: pedidoEncontrado,
      detalles,
    });
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);

    res.status(500).json({
      mensaje: "Error al obtener el detalle del pedido",
    });
  }
});

module.exports = router;
