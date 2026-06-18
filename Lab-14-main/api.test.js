import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './server.js';

describe('API DiscoStore', () => {

  it('GET /albumes - Debería listar slugs (200 y arreglo con slug sembrado)', async () => {
    const res = await request(app).get('/albumes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
   
    const hasThriller = res.body.some(album => album.slug === 'thriller');
    expect(hasThriller).toBe(true);
  });

  it('GET /album/:slug - Slug existente (200 y objeto del álbum)', async () => {
    const res = await request(app).get('/album/thriller');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('slug', 'thriller');
    expect(res.body).toHaveProperty('titulo', 'Thriller');
  });

  it('GET /album/:slug - Slug inexistente (404 en JSON)', async () => {
    const res = await request(app).get('/album/no-existe-este-album');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /search/:text - Texto < 3 caracteres (400 en JSON)', async () => {
    const res = await request(app).get('/search/ab');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /albumes - Cuerpo válido (201, cabecera Location y objeto creado)', async () => {
    const newAlbum = {
      titulo: "Test Album",
      artista: "Test Artist",
      genero: "Rock",
      anio: 2024,
      sello: "Test Label",
      pistas: 10,
      imagen: "test.jpg",
      resumen: "Resumen test",
      descripcion: "Descripcion test"
    };
    
    const res = await request(app).post('/albumes').send(newAlbum);
    expect(res.status).toBe(201);
    expect(res.headers).toHaveProperty('location');
    expect(res.headers.location).toBe('/album/test-album');
    expect(res.body).toHaveProperty('message');
    expect(res.body.album).toHaveProperty('slug', 'test-album');
  });

  it('POST /albumes - Cuerpo inválido (400 en JSON)', async () => {
    const invalidAlbum = {
      titulo: "Incomplete"
      
    };
    
    const res = await request(app).post('/albumes').send(invalidAlbum);
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /albumes - Slug duplicado (409 en JSON)', async () => {
    const duplicateAlbum = {
      titulo: "Thriller",
      artista: "Michael Jackson",
      genero: "Pop",
      anio: 1982,
      sello: "Epic",
      pistas: 9,
      imagen: "thriller.avif",
      resumen: "Resumen",
      descripcion: "Descripcion"
    };
    
    const res = await request(app).post('/albumes').send(duplicateAlbum);
    expect(res.status).toBe(409);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

  it('PUT /album/:slug - Existente y válido (200 y objeto actualizado)', async () => {
    const updatedData = {
      titulo: "Test Album Updated",
      artista: "Test Artist",
      genero: "Rock",
      anio: 2024,
      sello: "Test Label",
      pistas: 11,
      imagen: "test.jpg",
      resumen: "Resumen test actualizado",
      descripcion: "Descripcion test"
    };

    const res = await request(app).put('/album/test-album').send(updatedData);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /album/:slug - Inexistente (404 en JSON)', async () => {
    const updatedData = {
      titulo: "No Exist Updated",
      artista: "Test Artist",
      genero: "Rock",
      anio: 2024,
      sello: "Test Label",
      pistas: 10,
      imagen: "test.jpg",
      resumen: "Resumen test",
      descripcion: "Descripcion test"
    };

    const res = await request(app).put('/album/no-existe-este-album').send(updatedData);
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /album/:slug - Existente (204 sin cuerpo)', async () => {
    const res = await request(app).delete('/album/test-album');
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('DELETE /album/:slug - Inexistente (404 en JSON)', async () => {
    const res = await request(app).delete('/album/no-existe-este-album');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('error');
  });

});
