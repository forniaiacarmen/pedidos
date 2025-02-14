const express = require('express');
const router = express.Router();
const connection = require('../db');

// Crear un nuevo pedido
router.post('/', (req, res) => {
  const { nombre, fecha_recogida, telefono, producto, estado } = req.body;
  const query = 'INSERT INTO pedidos (nombre, fecha_recogida, telefono, producto, estado) VALUES (?, ?, ?, ?, ?)';

  connection.query(query, [nombre, fecha_recogida, telefono, producto, estado], (err, results) => {
    if (err) {
      console.error('Error al crear el pedido:', err);
      return res.status(500).send('Error al crear el pedido');
    }
    res.status(201).json({
      id: results.insertId,
      nombre,
      fecha_recogida,
      telefono,
      producto,
      estado
    });
  });
});

// Obtener todos los pedidos
router.get('/', (req, res) => {
  const query = 'SELECT * FROM pedidos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los pedidos:', err);
      return res.status(500).send('Error al obtener los pedidos');
    }
    res.json(results);
  });
});

// Obtener un pedido por su ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM pedidos WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener el pedido:', err);
      return res.status(500).send('Error al obtener el pedido');
    }
    if (results.length === 0) {
      return res.status(404).send('Pedido no encontrado');
    }
    res.json(results[0]);
  });
});

// Actualizar un pedido
// Actualizar un pedido (nombre, teléfono, fecha_recogida y estado)
router.put('/:id', (req, res) => {
  const { nombre, fecha_recogida, telefono, estado } = req.body;
  const query = 'UPDATE pedidos SET nombre = ?, fecha_recogida = ?, telefono = ?, estado = ? WHERE id = ?';

  connection.query(query, [nombre, fecha_recogida, telefono, estado, req.params.id], (err, results) => {
    if (err) {
      console.error('Error al actualizar el pedido:', err);
      return res.status(500).send('Error al actualizar el pedido');
    }
    res.json({ id: req.params.id, nombre, fecha_recogida, telefono, estado });
  });
});


// Cambiar el estado de un pedido (de pendiente a servido y viceversa)
// Cambiar el estado del pedido a "eliminado"
router.put('/estado/:id', (req, res) => {
  const nuevoEstado = req.body.estado;  // Recibimos el estado para actualizar
  const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';

  connection.query(query, [nuevoEstado, req.params.id], (err, results) => {
    if (err) {
      console.error('Error al cambiar el estado del pedido:', err);
      return res.status(500).send('Error al cambiar el estado del pedido');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Pedido no encontrado');
    }
    // Enviar de vuelta el estado actualizado
    res.json({ id: req.params.id, estado: nuevoEstado });
  });
});





// Eliminar un pedido
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM pedidos WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el pedido:', err);
      return res.status(500).send('Error al eliminar el pedido');
    }
    res.sendStatus(204);  // Respuesta sin contenido
  });
});

module.exports = router;
