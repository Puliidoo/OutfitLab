const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// CONFIGURACIÓN PGADMIN
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OutfitLab',
  password: '1234', 
  port: 5432,
});

// Probar conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error de conexión:', err.stack);
  }
  console.log('✅ Conexión exitosa a PostgreSQL');
  release();
});

// --- RUTA PARA REGISTRAR USUARIOS ---
app.post('/api/usuarios', async (req, res) => {
  // El nombre ahora es opcional en la desestructuración
  const { nombre, email, password } = req.body;

  // 🚩 VALIDACIÓN ACTUALIZADA: Ya no pedimos 'nombre' obligatoriamente
  if (!email || !password) {
    return res.status(400).json({ error: "El email y la contraseña son obligatorios" });
  }

  try {
    // Si el nombre no viene en el formulario, le ponemos "Usuario" por defecto
    const nombreFinal = nombre || 'Usuario';
    
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombreFinal, email, password];
    
    const result = await pool.query(query, values);
    
    console.log("👤 Usuario registrado:", result.rows[0].email);
    res.status(201).json({ 
      message: "¡Usuario creado con éxito!", 
      user: { email: result.rows[0].email } 
    });

  } catch (err) {
    console.error("❌ Error en DB:", err);
    if (err.code === '23505') {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error interno al guardar el usuario" });
  }
});

// --- RUTA PARA LOGIN ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);

    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      console.log("🔑 Login exitoso:", usuario.email);
      res.json({ 
        message: "Login correcto", 
        nombre: usuario.nombre 
      });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});