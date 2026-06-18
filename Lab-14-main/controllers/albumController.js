const db = require('../database');
const albumSchema = require('../schemas/albumSchema');

const generateSlug = (titulo) => {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const getInfo = (req, res) => {
  res.status(200).json({
    nombre: "DiscoStore API",
    version: "1.0.0",
    descripcion: "API para la gestión del catálogo de álbumes de DiscoStore"
  });
};

const getAllAlbums = (req, res) => {
  db.all('SELECT * FROM albumes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    res.status(200).json(rows);
  });
};

const getAlbumBySlug = (req, res) => {
  const { slug } = req.params;
  db.get('SELECT * FROM albumes WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Álbum no encontrado' });
    }
    res.status(200).json(row);
  });
};

const getSlugsByGenre = (req, res) => {
  const { genero } = req.params;
  db.all('SELECT slug FROM albumes WHERE LOWER(genero) = LOWER(?)', [genero], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    const slugs = rows.map(row => row.slug);
    res.status(200).json(slugs);
  });
};

const searchAlbums = (req, res) => {
  const { text } = req.params;
  
  if (text.length < 3) {
    return res.status(400).json({ error: 'El texto de búsqueda debe tener al menos 3 caracteres' });
  }

  const searchTerm = `%${text}%`;
  
  db.all(
    'SELECT * FROM albumes WHERE titulo LIKE ? OR artista LIKE ?',
    [searchTerm, searchTerm],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
      }
      res.status(200).json(rows);
    }
  );
};

const createAlbum = (req, res) => {
  const validation = albumSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Error de validación', 
      detalles: validation.error.errors 
    });
  }

  const album = validation.data;
  const slug = generateSlug(album.titulo);

  db.get('SELECT slug FROM albumes WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    if (row) {
      return res.status(409).json({ error: 'Ya existe un álbum con ese slug generado a partir del título.' });
    }

    const insertQuery = `
      INSERT INTO albumes (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      insertQuery,
      [
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
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
        }
        res.location(`/album/${slug}`);
        res.status(201).json({ 
          message: 'Álbum creado exitosamente',
          album: { slug, ...album }
        });
      }
    );
  });
};

const updateAlbum = (req, res) => {
  const { slug } = req.params;
  const validation = albumSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Error de validación', 
      detalles: validation.error.errors 
    });
  }

  const album = validation.data;

  db.get('SELECT slug FROM albumes WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Álbum no encontrado' });
    }

    const updateQuery = `
      UPDATE albumes 
      SET titulo = ?, artista = ?, genero = ?, anio = ?, sello = ?, pistas = ?, imagen = ?, resumen = ?, descripcion = ?
      WHERE slug = ?
    `;

    db.run(
      updateQuery,
      [
        album.titulo,
        album.artista,
        album.genero,
        album.anio,
        album.sello,
        album.pistas,
        album.imagen,
        album.resumen,
        album.descripcion,
        slug
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
        }
        res.status(200).json({ message: 'Álbum actualizado correctamente' });
      }
    );
  });
};

const deleteAlbum = (req, res) => {
  const { slug } = req.params;

  db.get('SELECT slug FROM albumes WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Álbum no encontrado' });
    }

    db.run('DELETE FROM albumes WHERE slug = ?', [slug], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
      }
      res.status(204).send();
    });
  });
};

module.exports = {
  getInfo,
  getAllAlbums,
  getAlbumBySlug,
  getSlugsByGenre,
  searchAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum
};
