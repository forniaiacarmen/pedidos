// backend/config/db.js

const mysql = require('mysql2');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',  // Dirección del servidor de MariaDB (puede ser una IP o un dominio)
    user: 'empleado', // Tu nombre de usuario en MariaDB
    password: 'pepepepe', // Tu contraseña
    database: 'pedidos',  // El nombre de la base de datos con la que te quieres conectar
    port: 3306  // El puerto de MariaDB, por defecto es 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID ' + connection.threadId);
});

module.exports = connection;
