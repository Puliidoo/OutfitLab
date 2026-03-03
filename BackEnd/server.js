const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// CONFIGURACIÓN PGADMIN - REVISA ESTOS DATOS
// En tu archivo BackEnd/server.js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OutfitLab',
  password: '1234', // <--- Cambia esto
  port: 5432,
});

// Probar conexión a la base de datos al arrancar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo el cliente', err.stack);
  }
  console.log('Conexión exitosa a PostgreSQL');
  release();
});

// RUTA PARA REGISTRAR USUARIOS
app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación básica
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, email, password];
    
    const result = await pool.query(query, values);
    
    console.log("Usuario guardado en DB:", result.rows[0]);
    res.status(201).json({ 
      message: "¡Usuario creado con éxito!", 
      user: result.rows[0] 
    });

  } catch (err) {
    console.error("Error en la base de datos:", err);
    if (err.code === '23505') { // Error de email duplicado
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error interno al guardar el usuario" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});