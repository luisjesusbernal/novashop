# NovaShop - Sistema Web de Tienda en Línea

NovaShop es una aplicación web empresarial desarrollada como proyecto académico para la materia de Desarrollo Web Integral.

El sistema permite administrar una tienda en línea mediante un panel de administrador y una vista para clientes. Incluye autenticación, control de roles, gestión de productos, categorías, usuarios, pedidos, reportes, carrito de compras y método de pago simulado.

## Objetivo del proyecto

Desarrollar una aplicación web funcional que permita gestionar los procesos principales de una tienda en línea, aplicando arquitectura de software, frameworks web, API REST, base de datos relacional, seguridad básica, pruebas y versionamiento con Git.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MySQL
- bcrypt
- JSON Web Token

### Base de datos

- MySQL
- MySQL Workbench

### Herramientas de desarrollo

- Visual Studio Code
- Thunder Client
- Git
- GitHub
- dbdiagram.io

## Funcionalidades principales

### Administrador

- Inicio de sesión.
- Dashboard con resumen general.
- CRUD completo de productos.
- CRUD completo de categorías.
- CRUD completo de usuarios.
- Administración de roles de usuario.
- Consulta de pedidos realizados por clientes.
- Consulta del detalle de cada pedido.
- Cambio de estado de pedidos.
- Reportes básicos de usuarios, productos, categorías, pedidos y ventas.

### Cliente

- Registro de cuenta.
- Inicio de sesión.
- Consulta de catálogo de productos.
- Carrito de compras.
- Selección de método de pago simulado.
- Finalización de pedido.
- Consulta de historial de pedidos.
- Consulta del detalle de sus pedidos.

## Seguridad implementada

- Protección de contraseñas con bcrypt.
- Autenticación mediante JWT.
- Rutas protegidas en el backend.
- Restricción de módulos según rol.
- Validación de entradas.
- Validación de formato de correo.
- Validación de contraseña segura para nuevos usuarios.
- Control de acceso para rutas administrativas.
- Prevención de eliminación del usuario administrador actualmente logueado.
- Prevención de cambio de rol del usuario administrador actualmente logueado.

## Estructura del proyecto

```text
novashop/
├── backend/
│   ├── database/
│   │   └── schema.sql
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── catalogo.routes.js
│   │   ├── categorias.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── pedidos.routes.js
│   │   ├── productos.routes.js
│   │   └── usuarios.routes.js
│   ├── db.js
│   ├── seedPasswords.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Categorias.jsx
│   │   │   ├── ClienteHome.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MisPedidos.jsx
│   │   │   ├── Pedidos.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Reportes.jsx
│   │   │   └── Usuarios.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
│
├── .gitignore
└── README.md
```

## Instalación del proyecto

Esta sección explica cómo ejecutar el proyecto desde cero.

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd novashop
```

Nota: reemplazar `URL_DEL_REPOSITORIO` por la liga real del repositorio en GitHub.

### 2. Configurar la base de datos

Crear la base de datos en MySQL usando el archivo:

```text
backend/database/schema.sql
```

Este archivo contiene la estructura principal de la base de datos.

También puede ejecutarse directamente desde MySQL Workbench.

### 3. Configurar variables de entorno

Dentro de la carpeta `backend`, crear un archivo llamado `.env`.

Se puede tomar como base el archivo `.env.example`.

Ejemplo:

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=novashop_db

JWT_SECRET=tu_clave_secreta
```

### 4. Instalar dependencias del backend

Desde la carpeta del proyecto, entrar al backend:

```bash
cd backend
npm install
```

### 5. Ejecutar backend

```bash
npm run dev
```

El backend se ejecuta en:

```text
http://localhost:3001
```

### 6. Instalar dependencias del frontend

Abrir otra terminal y entrar a la carpeta frontend:

```bash
cd frontend
npm install
```

### 7. Ejecutar frontend

```bash
npm run dev
```

El frontend normalmente se ejecuta en:

```text
http://localhost:5173
```

Si ese puerto está ocupado, Vite puede asignar otro puerto, por ejemplo:

```text
http://localhost:5174
```

## Usuarios de prueba

### Administrador

```text
Correo: admin@novashop.com
Contraseña: admin123
```

### Cliente

```text
Correo: cliente@novashop.com
Contraseña: cliente123
```

Estos usuarios se utilizan para pruebas y demostración del sistema.

## Base de datos

La base de datos utilizada se llama:

```text
novashop_db
```

### Tablas principales

- roles
- usuarios
- categorias
- productos
- pedidos
- detalle_pedidos

### Descripción de tablas

#### roles

Almacena los tipos de usuario del sistema, como Administrador y Cliente.

#### usuarios

Almacena los datos de los usuarios registrados, incluyendo nombre, correo, contraseña protegida, teléfono, dirección y rol.

#### categorias

Almacena las categorías utilizadas para clasificar los productos.

#### productos

Almacena los productos de la tienda, incluyendo nombre, descripción, precio, stock, imagen, categoría y estado.

#### pedidos

Almacena la información general de cada pedido realizado por un cliente, incluyendo usuario, fecha, total, estado y método de pago.

#### detalle_pedidos

Almacena los productos incluidos dentro de cada pedido, incluyendo cantidad, precio unitario y subtotal.

### Relaciones principales

- Un rol puede tener muchos usuarios.
- Un usuario pertenece a un rol.
- Una categoría puede tener muchos productos.
- Un producto pertenece a una categoría.
- Un usuario puede realizar muchos pedidos.
- Un pedido pertenece a un usuario.
- Un pedido puede tener varios detalles de pedido.
- Un producto puede aparecer en varios detalles de pedido.

## API REST

El sistema cuenta con una API REST desarrollada con Node.js y Express.

La API permite conectar el frontend con la base de datos MySQL mediante endpoints HTTP que devuelven respuestas en formato JSON.

## Endpoints principales

### Autenticación

```text
POST /api/login
POST /api/register
```

### Usuarios

```text
GET /api/usuarios
GET /api/usuarios/:id
POST /api/usuarios
PUT /api/usuarios/:id
PUT /api/usuarios/:id/password
DELETE /api/usuarios/:id
```

### Productos

```text
GET /api/productos
GET /api/productos/:id
POST /api/productos
PUT /api/productos/:id
DELETE /api/productos/:id
```

### Categorías

```text
GET /api/categorias
GET /api/categorias/:id
POST /api/categorias
PUT /api/categorias/:id
DELETE /api/categorias/:id
```

### Catálogo

```text
GET /api/catalogo
```

### Pedidos

```text
GET /api/pedidos
GET /api/pedidos/mis-pedidos
GET /api/pedidos/:id
POST /api/pedidos
PUT /api/pedidos/:id/estado
```

### Dashboard y reportes

```text
GET /api/dashboard/resumen
GET /api/dashboard/stock-bajo
```

## Flujo general del sistema

### Flujo del administrador

1. El administrador inicia sesión.
2. El sistema valida sus credenciales.
3. El backend devuelve un token JWT.
4. El administrador accede al panel administrativo.
5. Puede gestionar usuarios, productos, categorías, pedidos y reportes.

### Flujo del cliente

1. El cliente se registra o inicia sesión.
2. El sistema valida sus credenciales.
3. El cliente accede al catálogo.
4. Agrega productos al carrito.
5. Selecciona un método de pago simulado.
6. Finaliza el pedido.
7. El pedido se guarda en la base de datos.
8. El cliente puede consultar su historial en “Mis pedidos”.

## Métodos de pago simulados

El sistema no integra una pasarela de pagos real. Para fines académicos, se agregaron métodos de pago simulados:

- Pago contra entrega
- Transferencia bancaria
- Tarjeta simulada

Estos métodos se guardan en la tabla `pedidos`.

## Validaciones implementadas

El sistema incluye validaciones en frontend y backend.

### Validaciones de usuario

- Nombre obligatorio.
- Correo obligatorio.
- Formato válido de correo.
- Correo único.
- Contraseña obligatoria.
- Contraseña segura para nuevos registros.

### Política de contraseña para nuevos usuarios

La contraseña debe contener:

- Mínimo 8 caracteres.
- Una letra mayúscula.
- Una letra minúscula.
- Un número.
- Un carácter especial.

### Validaciones de producto

- Nombre obligatorio.
- Precio obligatorio.
- Precio mayor que cero.
- Stock obligatorio.
- Stock no negativo.
- Categoría obligatoria.

### Validaciones de pedidos

- El pedido debe tener al menos un producto.
- La cantidad debe ser válida.
- El producto debe existir.
- El producto debe estar activo.
- Debe existir stock suficiente.
- El método de pago debe ser válido.

## Control de roles

El sistema maneja dos roles principales:

### Administrador

Puede acceder al panel administrativo y gestionar la información principal del sistema.

### Cliente

Puede acceder al catálogo, carrito y consulta de sus propios pedidos.

El acceso a rutas administrativas está protegido mediante middleware y token JWT.

## Versionamiento

El proyecto utiliza Git como sistema de control de versiones.

Se realizaron commits descriptivos durante el desarrollo del sistema, cumpliendo con el mínimo solicitado para el proyecto académico.

## Estado actual del proyecto

El sistema se encuentra en una versión funcional con los siguientes módulos implementados:

- Login
- Registro
- CRUD de usuarios
- CRUD de productos
- CRUD de categorías
- Dashboard
- Reportes
- Catálogo de cliente
- Carrito de compras
- Pedidos reales en base de datos
- Historial de pedidos del cliente
- Gestión de pedidos por administrador
- Cambio de estado de pedidos
- Método de pago simulado
- Seguridad con JWT
- Validaciones de entrada
- Control de roles

## Ejecución rápida en desarrollo

Para iniciar el proyecto en desarrollo se deben abrir dos terminales.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Después, abrir en el navegador la URL que indique Vite, normalmente:

```text
http://localhost:5173
```

## Autor

Luis Jesus Bernal