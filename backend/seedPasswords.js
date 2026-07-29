const bcrypt = require("bcrypt");
const db = require("./db");

async function actualizarPasswords() {
  try {
    const adminHash = await bcrypt.hash("admin123", 10);
    const clienteHash = await bcrypt.hash("cliente123", 10);

    await db.query(
      "UPDATE usuarios SET password = ? WHERE correo = ?",
      [adminHash, "admin@novashop.com"]
    );

    await db.query(
      "UPDATE usuarios SET password = ? WHERE correo = ?",
      [clienteHash, "cliente@novashop.com"]
    );

    console.log("Contraseñas actualizadas con bcrypt correctamente.");
    process.exit();
  } catch (error) {
    console.error("Error al actualizar contraseñas:", error);
    process.exit(1);
  }
}

actualizarPasswords();