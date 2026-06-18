require('dotenv').config();
const express = require('express');
const path = require('path');
const albumRoutes = require('./routes/albumRoutes');

require('./database');

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';


app.use(express.json());


app.use('/imagenes', express.static(path.join(__dirname, 'public', 'imagenes')));


app.use('/', albumRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Servidor de DiscoStore corriendo en http://${HOST}:${PORT}`);
  });
}

module.exports = app;
