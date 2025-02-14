// backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const pedidosRoutes = require('./routes/pedidos');
app.use('/api/pedidos', pedidosRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
