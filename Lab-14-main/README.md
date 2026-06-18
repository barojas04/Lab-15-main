# DiscoStore API

API REST para la gestión del catálogo de álbumes de DiscoStore.
Construida con Node.js puro, Express, SQLite (sqlite3), Zod y Dotenv.

## Requisitos Previos

- Node.js instalado
- NPM (viene con Node.js)

## Instalación y Configuración

1. **Instalar dependencias**
   Abre una terminal en la raíz del proyecto y ejecuta:

   ```bash
   npm install
   ```

   Esto instalará `express`, `sqlite3`, `zod` y `dotenv`.

2. **Variables de Entorno**
   Verifica que exista un archivo `.env` en la raíz con el siguiente contenido (ya provisto):
   ```env
   PORT=3000
   HOST=localhost
   ```

## Población de la Base de Datos

La base de datos se inicializa de forma automática y obligatoria la primera vez que arranca el servidor.
Al iniciarse, verifica si la tabla `albumes` está vacía en el archivo `discostore.sqlite`. Si es así, carga automáticamente los registros provenientes de `albumes.json`.

## Ejecutar el Servidor

en modo desarrollo

```bash
npm run dev
```

## Ejemplos de Uso Rápido

Los siguientes links son para ver las imagenes, con el servidor corriendo:

- **Ver todo el catálogo (JSON)**: [http://localhost:3000/albumes](http://localhost:3000/albumes)
- **Ver portada de Thriller**: [http://localhost:3000/imagenes/thriller.avif](http://localhost:3000/imagenes/thriller.avif)
- **Ver portada de Nevermind**: [http://localhost:3000/imagenes/nevermind.avif](http://localhost:3000/imagenes/nevermind.avif)
- **Ver portada de Abbey Road**: [http://localhost:3000/imagenes/abbey-road.avif](http://localhost:3000/imagenes/abbey-road.avif)

Y asi para el resto de imagenes.

## Pruebas (Testing)

El proyecto incluye una suite completa de pruebas unitarias y de integración para asegurar el correcto funcionamiento de los endpoints. Para las pruebas se utilizaron las siguientes herramientas:

- **[Vitest](https://vitest.dev/):** Framework de pruebas (test runner).
- **[Supertest](https://github.com/ladjs/supertest):** Herramienta para simular peticiones HTTP y probar las rutas de Express.

### Cómo ejecutar las pruebas

Para correr la suite de pruebas, abrir la terminal y ejecutar:

```bash
npm test
```

### Casos evaluados

El archivo `api.test.js` cubre el 100% de los casos requeridos:

- **Listar álbumes:** `GET /albumes` responde con 200 y comprueba la existencia de un slug sembrado.
- **Obtener por slug (Éxito):** `GET /album/:slug` responde con 200 y la información del álbum.
- **Obtener por slug (Error):** `GET /album/:slug` responde con 404 para un slug inexistente.
- **Buscar álbum:** `GET /search/:text` valida que el texto tenga al menos 3 caracteres; de lo contrario, devuelve 400.
- **Crear álbum (Éxito):** `POST /albumes` con datos válidos devuelve 201, el objeto creado y la cabecera `Location`.
- **Crear álbum (Error validación):** `POST /albumes` con cuerpo inválido responde con 400.
- **Crear álbum (Error duplicado):** `POST /albumes` con un slug existente responde con 409.
- **Actualizar álbum (Éxito):** `PUT /album/:slug` sobre un elemento existente devuelve 200.
- **Actualizar álbum (Error):** `PUT /album/:slug` sobre un elemento inexistente devuelve 404.
- **Eliminar álbum (Éxito):** `DELETE /album/:slug` existente responde con 204 sin cuerpo.
- **Eliminar álbum (Error):** `DELETE /album/:slug` inexistente responde con 404.
