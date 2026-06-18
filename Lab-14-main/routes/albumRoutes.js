const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

router.get('/', albumController.getInfo);
router.get('/albumes', albumController.getAllAlbums);
router.get('/album/:slug', albumController.getAlbumBySlug);
router.get('/genero/:genero', albumController.getSlugsByGenre);
router.get('/search/:text', albumController.searchAlbums);
router.post('/albumes', albumController.createAlbum);
router.put('/album/:slug', albumController.updateAlbum);
router.delete('/album/:slug', albumController.deleteAlbum);

module.exports = router;
