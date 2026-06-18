const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'discostore.sqlite');
const jsonPath = path.resolve(__dirname, 'albumes.json');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    initDb();
  }
});

function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS albumes (
      slug TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      artista TEXT NOT NULL,
      genero TEXT NOT NULL,
      anio INTEGER NOT NULL,
      sello TEXT NOT NULL,
      pistas INTEGER NOT NULL,
      imagen TEXT NOT NULL,
      resumen TEXT NOT NULL,
      descripcion TEXT NOT NULL
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err.message);
      return;
    }
    
    db.get('SELECT COUNT(*) AS count FROM albumes', (err, row) => {
      if (err) {
        console.error('Error al verificar registros:', err.message);
        return;
      }
      
      if (row.count === 0) {
        cargarDatosIniciales();
      } else {
        console.log('La base de datos ya contiene datos. No se requiere carga inicial.');
      }
    });
  });
}

function cargarDatosIniciales() {
  try {
    const data = fs.readFileSync(jsonPath, 'utf-8');
    const albumes = JSON.parse(data);
    
    const insertQuery = `
      INSERT INTO albumes (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const stmt = db.prepare(insertQuery);
      
      albumes.forEach((album) => {
        const slug = album.slug || album.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        stmt.run([
          slug,
          album.titulo,
          album.artista,
          album.genero,
          album.anio,
          album.sello,
          album.pistas,
          album.imagen,
          album.resumen,
          album.descripcion
        ]);
      });
      
      stmt.finalize();
      db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error al hacer commit de los datos iniciales:', err.message);
        } else {
          console.log('Datos iniciales cargados correctamente desde albumes.json.');
        }
      });
    });
  } catch (error) {
    console.error('Error al cargar datos desde JSON:', error.message);
  }
}

module.exports = db;
