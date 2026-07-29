const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token no proporcionado."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token inválido."
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado."
    });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario.id_rol !== 1) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol de administrador."
    });
  }

  next();
}

module.exports = {
  verificarToken,
  soloAdmin
};