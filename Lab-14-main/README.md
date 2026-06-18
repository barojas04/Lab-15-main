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
