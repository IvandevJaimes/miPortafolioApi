# API del Portafolio

API REST desarrollada con Express y TypeScript para gestionar el portafolio personal.

● Repo frontend: https://github.com/IvandevJaimes/miPortafolio

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Lenguaje:** TypeScript
- **Base de datos:** MySQL (mysql2)
- **Autenticacion:** JWT (jsonwebtoken) + bcrypt

## Librerías

### Dependencies
- bcrypt - Hash de contraseñas
- cloudinary - Almacenamiento de imagenes
- cors - CORS middleware
- dotenv - Variables de entorno
- express-rate-limit - Limitacion de peticiones
- helmet - Headers de seguridad
- jsonwebtoken - Tokens JWT
- morgan - Logging de requests
- multer - Upload de archivos
- mysql2 - Driver MySQL
- resend - Envío de emails
- zod - Validación de datos

### Dev Dependencies
- typescript
- tsx - Ejecución de TypeScript
- eslint + @typescript-eslint

## Estructura del Proyecto

```
src/
├── config/          # Configuracion (DB, variables de entorno, rate limiters)
├── controllers/    # Controladores (logica de negocio)
├── database/       # Conexion a MySQL
├── errors/         # Errores personalizados
├── middleware/    # Middlewares (auth, upload, error handling)
├── models/         # Tipos e interfaces
├── routes/        # Rutas de la API
├── services/       # Acceso a datos
├── templates/      # Plantillas HTML para emails
└── utils/         # Utilidades (JWT, validación de ID)
```

## Endpoints

| Ruta | Metodo | Descripcion | Autenticacion |
|------|-------|-----------|------------|
| /projects | GET | Listar proyectos | No |
| /projects/:id | GET | Obtener proyecto | No |
| /projects | POST | Crear proyecto | Si |
| /projects/:id | PUT | Actualizar proyecto | Si |
| /projects/:id | DELETE | Eliminar proyecto | Si |
| /profile | GET | Obtener perfil | No |
| /profile | PUT | Actualizar perfil | Si |
| /auth/login | POST | Iniciar sesion | No |
| /skills | GET | Listar skills | No |
| /skills/categories | POST | Crear categoria | Si |
| /skills/skills | POST | Crear skill | Si |
| /contact | GET | Listar mensajes | Si |
| /contact | POST | Enviar mensaje | No |
| /contact/:id | GET | Ver mensaje | Si |
| /contact/:id/read | PUT | Marcar como leido | Si |
| /contact/:id | DELETE | Eliminar mensaje | Si |
| /health | GET | Estado del servidor | No |

## Seguridad

- Helmet para headers de seguridad
- Rate limiting (general, auth, contact)
- Autenticacion JWT en rutas protegidas
- Validacion de entrada con Zod
- Manejo centralizado de errores

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Produccion

```bash
npm run build
npm start
```

## Variables de Entorno

Ver `.env.example` para las variables requeridas.

## Base de Datos

El schema de la base de datos esta en `schema.sql`.