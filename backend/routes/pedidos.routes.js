const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

console.log("✅ pedidos.routes.js 9C cargado correctamente");

function obtenerToken(req) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

function autenticacionOpcional(req, res, next) {
  const token = obtenerToken(req);

  if (!token) {
    return next();
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token no válido o expirado",
    });
  }
}

function requerirAutenticacion(req, res, next) {
  const token = obtenerToken(req);

  if (!token) {
    return res.status(401).json({
      mensaje: "Token no proporcionado",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token no válido o expirado",
    });
  }
}

function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.id_rol !== 1) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol de administrador.",
    });
  }

  return next();
}

const metodosPagoPermitidos = [
  "Pago contra entrega",
  "Transferencia bancaria",
  "Tarjeta simulada",
  "PayPal simulado",
];

const metodosEnvioPermitidos = {
  estandar: {
    nombre: "Envío estándar",
    costo: 99,
  },
  express: {
    nombre: "Envío express",
    costo: 179,
  },
  recoger: {
    nombre: "Recoger en punto acordado",
    costo: 0,
  },
  "Envío estándar": {
    nombre: "Envío estándar",
    costo: 99,
  },
  "Envío express": {
    nombre: "Envío express",
    costo: 179,
  },
  "Recoger en punto acordado": {
    nombre: "Recoger en punto acordado",
    costo: 0,
  },
};

// Crear pedido desde checkout público o cliente registrado
router.post("/", autenticacionOpcional, async (req, res) => {
  const {
    productos,
    cliente = {},
    direccion = {},
    metodo_pago,
    metodo_envio,
  } = req.body || {};

  const idUsuario = req.usuario?.id_usuario || null;

  const metodoPagoFinal = metodo_pago || "Pago contra entrega";
  const envioSeleccionado = metodosEnvioPermitidos[metodo_envio || "estandar"];

  if (!metodosPagoPermitidos.includes(metodoPagoFinal)) {
    return res.status(400).json({
      mensaje: "Método de pago no válido",
    });
  }

  if (!envioSeleccionado) {
    return res.status(400).json({
      mensaje: "Método de envío no válido",
    });
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      mensaje: "El pedido debe incluir al menos un producto",
    });
  }

  const clienteNombre = cliente.nombre || req.usuario?.nombre || "";
  const clienteCorreo = cliente.correo || req.usuario?.correo || "";
  const clienteTelefono = cliente.telefono || "";

  const direccionEntrega =
    direccion.direccion_entrega || direccion.direccion || "";

  const direccionExtra =
    direccion.direccion_extra || direccion.direccionExtra || "";

  const codigoPostal =
    direccion.codigo_postal || direccion.codigoPostal || "";

  const ciudad = direccion.ciudad || "";

  const estadoEntrega =
    direccion.estado_entrega || direccion.estado || "";

  const pais = direccion.pais || "México";

  if (!clienteNombre || !clienteCorreo || !clienteTelefono) {
    return res.status(400).json({
      mensaje: "Completa los datos personales del cliente",
    });
  }

  if (!direccionEntrega || !codigoPostal || !ciudad || !estadoEntrega) {
    return res.status(400).json({
      mensaje: "Completa los datos de dirección de entrega",
    });
  }

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteCorreo);

  if (!correoValido) {
    return res.status(400).json({
      mensaje: "El correo electrónico no tiene un formato válido",
    });
  }

  const conexion = await db.getConnection();

  try {
    await conexion.beginTransaction();

    let subtotalPedido = 0;
    const detalles = [];

    for (const item of productos) {
      const idProducto = Number(item.id_producto);
      const cantidad = Number(item.cantidad);

      if (!idProducto || !Number.isInteger(cantidad) || cantidad <= 0) {
        await conexion.rollback();

        return res.status(400).json({
          mensaje: "Todos los productos deben tener ID y cantidad válida",
        });
      }

      const [productoEncontrado] = await conexion.query(
        `
        SELECT 
          id_producto,
          nombre,
          precio,
          stock,
          estado
        FROM productos
        WHERE id_producto = ?
        `,
        [idProducto]
      );

      if (productoEncontrado.length === 0) {
        await conexion.rollback();

        return res.status(404).json({
          mensaje: `El producto con ID ${idProducto} no existe`,
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

      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * cantidad;

      subtotalPedido += subtotal;

      detalles.push({
        id_producto: idProducto,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal,
      });
    }

    const costoEnvio = Number(envioSeleccionado.costo);
    const totalPedido = subtotalPedido + costoEnvio;

    const [resultadoPedido] = await conexion.query(
      `
      INSERT INTO pedidos (
        id_usuario,
        cliente_nombre,
        cliente_correo,
        cliente_telefono,
        direccion_entrega,
        direccion_extra,
        codigo_postal,
        ciudad,
        estado_entrega,
        pais,
        total,
        estado,
        metodo_pago,
        metodo_envio,
        costo_envio,
        subtotal
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        idUsuario,
        clienteNombre,
        clienteCorreo,
        clienteTelefono,
        direccionEntrega,
        direccionExtra,
        codigoPostal,
        ciudad,
        estadoEntrega,
        pais,
        totalPedido,
        "Pendiente",
        metodoPagoFinal,
        envioSeleccionado.nombre,
        costoEnvio,
        subtotalPedido,
      ]
    );

    const idPedido = resultadoPedido.insertId;

    for (const detalle of detalles) {
      await conexion.query(
        `
        INSERT INTO detalle_pedidos (
          id_pedido,
          id_producto,
          cantidad,
          precio_unitario,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          idPedido,
          detalle.id_producto,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal,
        ]
      );

      await conexion.query(
        "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
        [detalle.cantidad, detalle.id_producto]
      );
    }

    await conexion.commit();

    return res.status(201).json({
      mensaje: "Pedido creado correctamente",
      id_pedido: idPedido,
      subtotal: subtotalPedido,
      costo_envio: costoEnvio,
      total: totalPedido,
      metodo_pago: metodoPagoFinal,
      metodo_envio: envioSeleccionado.nombre,
      tipo_cliente: idUsuario ? "Registrado" : "Invitado",
    });
  } catch (error) {
    await conexion.rollback();

    console.error("Error al crear pedido:", error);

    return res.status(500).json({
      mensaje: "Error al crear el pedido",
    });
  } finally {
    conexion.release();
  }
});

// Obtener pedidos del cliente que inició sesión
router.get("/mis-pedidos", requerirAutenticacion, async (req, res) => {
  const idUsuario = req.usuario.id_usuario;

  try {
    const [pedidos] = await db.query(
      `
      SELECT 
        id_pedido,
        fecha_pedido,
        subtotal,
        costo_envio,
        total,
        estado,
        metodo_pago,
        metodo_envio
      FROM pedidos
      WHERE id_usuario = ?
      ORDER BY fecha_pedido DESC
      `,
      [idUsuario]
    );

    return res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos del cliente:", error);

    return res.status(500).json({
      mensaje: "Error al obtener los pedidos",
    });
  }
});

// Obtener todos los pedidos, solo administrador
router.get("/", requerirAutenticacion, soloAdmin, async (req, res) => {
  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id_pedido,
        p.id_usuario,
        p.cliente_nombre,
        p.cliente_correo,
        p.cliente_telefono,
        p.fecha_pedido,
        p.subtotal,
        p.costo_envio,
        p.total,
        p.estado,
        p.metodo_pago,
        p.metodo_envio,
        COALESCE(u.nombre, p.cliente_nombre) AS cliente,
        COALESCE(u.correo, p.cliente_correo) AS correo,
        CASE 
          WHEN p.id_usuario IS NULL THEN 'Invitado'
          ELSE 'Registrado'
        END AS tipo_cliente
      FROM pedidos p
      LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
      ORDER BY p.fecha_pedido DESC
    `);

    return res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    return res.status(500).json({
      mensaje: "Error al obtener los pedidos",
    });
  }
});

// Actualizar estado de un pedido, solo administrador
router.put(
  "/:id/estado",
  requerirAutenticacion,
  soloAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body || {};

    const estadosPermitidos = [
      "Pendiente",
      "En proceso",
      "Completado",
      "Cancelado",
    ];

    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido",
      });
    }

    try {
      const [pedidoEncontrado] = await db.query(
        "SELECT id_pedido FROM pedidos WHERE id_pedido = ?",
        [id]
      );

      if (pedidoEncontrado.length === 0) {
        return res.status(404).json({
          mensaje: "Pedido no encontrado",
        });
      }

      await db.query(
        "UPDATE pedidos SET estado = ? WHERE id_pedido = ?",
        [estado, id]
      );

      return res.json({
        mensaje: "Estado del pedido actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar estado del pedido:", error);

      return res.status(500).json({
        mensaje: "Error al actualizar el estado del pedido",
      });
    }
  }
);

// Consultar pedido público por folio y correo
router.get("/consulta/:id", async (req, res) => {
  const { id } = req.params;
  const { correo } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      mensaje: "Folio de pedido no válido",
    });
  }

  if (!correo) {
    return res.status(400).json({
      mensaje: "El correo electrónico es obligatorio",
    });
  }

  try {
    const [pedido] = await db.query(
      `
      SELECT 
        p.id_pedido,
        p.id_usuario,
        p.cliente_nombre,
        p.cliente_correo,
        p.cliente_telefono,
        p.direccion_entrega,
        p.direccion_extra,
        p.codigo_postal,
        p.ciudad,
        p.estado_entrega,
        p.pais,
        p.fecha_pedido,
        p.subtotal,
        p.costo_envio,
        p.total,
        p.estado,
        p.metodo_pago,
        p.metodo_envio,
        COALESCE(u.nombre, p.cliente_nombre) AS cliente,
        COALESCE(u.correo, p.cliente_correo) AS correo,
        CASE 
          WHEN p.id_usuario IS NULL THEN 'Invitado'
          ELSE 'Registrado'
        END AS tipo_cliente
      FROM pedidos p
      LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
        AND LOWER(COALESCE(p.cliente_correo, u.correo)) = LOWER(?)
      `,
      [id, correo]
    );

    if (pedido.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró un pedido con ese folio y correo",
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
      [id]
    );

    return res.json({
      pedido: pedido[0],
      detalles,
    });
  } catch (error) {
    console.error("Error al consultar pedido público:", error);

    return res.status(500).json({
      mensaje: "Error al consultar el pedido",
    });
  }
});

// Obtener detalle de un pedido
router.get("/:id", requerirAutenticacion, async (req, res) => {
  const { id } = req.params;

  try {
    const [pedido] = await db.query(
      `
      SELECT 
        p.id_pedido,
        p.id_usuario,
        p.cliente_nombre,
        p.cliente_correo,
        p.cliente_telefono,
        p.direccion_entrega,
        p.direccion_extra,
        p.codigo_postal,
        p.ciudad,
        p.estado_entrega,
        p.pais,
        p.fecha_pedido,
        p.subtotal,
        p.costo_envio,
        p.total,
        p.estado,
        p.metodo_pago,
        p.metodo_envio,
        COALESCE(u.nombre, p.cliente_nombre) AS cliente,
        COALESCE(u.correo, p.cliente_correo) AS correo,
        CASE 
          WHEN p.id_usuario IS NULL THEN 'Invitado'
          ELSE 'Registrado'
        END AS tipo_cliente
      FROM pedidos p
      LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
      `,
      [id]
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
      [id]
    );

    return res.json({
      pedido: pedidoEncontrado,
      detalles,
    });
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el detalle del pedido",
    });
  }
});

module.exports = router;