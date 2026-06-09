require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const crypto = require('crypto');

const hashImagen = (base64) => crypto.createHash('sha256').update(base64.slice(0, 500)).digest('hex');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/demo', require('express').static(__dirname));

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

// --- RUTA PARA OBTENER DATOS DEL USUARIO ---
app.get('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, fecha FROM usuarios WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- RUTA PARA ACTUALIZAR DATOS DEL USUARIO ---
app.put('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;
  const { nombre, password_actual, password_nueva } = req.body;

  try {
    if (password_nueva) {
      const check = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1 AND password = $2',
        [email, password_actual]
      );
      if (check.rows.length === 0) {
        return res.status(401).json({ error: "La contraseña actual no es correcta" });
      }
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE email = $2',
        [password_nueva, email]
      );
    }

    if (nombre) {
      await pool.query(
        'UPDATE usuarios SET nombre = $1 WHERE email = $2',
        [nombre, email]
      );
    }

    const updated = await pool.query(
      'SELECT id, nombre, email, fecha FROM usuarios WHERE email = $1',
      [email]
    );
    res.json({ message: "Perfil actualizado", user: updated.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- GUARDAR LOOK GENERADO ---
app.post('/api/outfits', async (req, res) => {
  const { email, imagen_generada, nombre } = req.body;
  try {
    const usuario = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (usuario.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const result = await pool.query(
      'INSERT INTO outfits (nombre, usuario_id, imagen_generada, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [nombre || 'Look', usuario.rows[0].id, imagen_generada]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el look" });
  }
});

// --- OBTENER LOOKS DEL USUARIO ---
app.get('/api/outfits/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const usuario = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (usuario.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const result = await pool.query(
      'SELECT * FROM outfits WHERE usuario_id = $1 ORDER BY fecha DESC',
      [usuario.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los looks" });
  }
});

// --- ELIMINAR LOOK ---
app.delete('/api/outfits/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM outfits WHERE id = $1', [id]);
    res.json({ message: "Look eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el look" });
  }
});

// Lee los tokens directamente del .env para evitar problemas con dotenv
const fs_env = require('fs');
const path_env = require('path');
const envPath = path_env.join(__dirname, '.env');
const envContent = fs_env.readFileSync(envPath, 'utf8');
const HF_TOKENS = envContent.split('\n')
  .filter(line => line.startsWith('HF_TOKEN_'))
  .map(line => line.split('=').slice(1).join('=').trim())
  .filter(t => t && t.startsWith('hf_'));

console.log(`🔑 Tokens de Hugging Face cargados: ${HF_TOKENS.length}`);

// --- HUGGING FACE: PRUEBA VIRTUAL CON ROTACIÓN DE TOKENS ---
app.post('/api/tryon', async (req, res) => {
  const { model_image, garment_image, category, email } = req.body;

  if (!model_image || !garment_image) {
    return res.status(400).json({ error: "Se necesita la foto del usuario y la prenda" });
  }

  const fs   = require('fs');
  const os   = require('os');
  const path = require('path');

  const guardarTemporal = (base64) => {
    const [meta, data] = base64.split(',');
    const ext = meta.includes('png') ? 'png' : 'jpg';
    const ruta = path.join(os.tmpdir(), `tryon_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
    fs.writeFileSync(ruta, Buffer.from(data, 'base64'));
    return ruta;
  };

  const rutaUsuario = guardarTemporal(model_image);
  const rutaPrenda  = guardarTemporal(garment_image);

  // --- COMPROBAR CACHÉ ---
  const gHash = hashImagen(garment_image);
  const mHash = hashImagen(model_image);
  const cat   = category || 'tops';

  // Caché personal: misma persona + misma prenda → devuelve su resultado anterior
  const personalCache = await pool.query(
    'SELECT resultado_url FROM busquedas_historial WHERE model_hash = $1 AND garment_hash = $2 ORDER BY fecha DESC LIMIT 1',
    [mHash, gHash]
  );

  if (personalCache.rows.length > 0) {
    console.log('⚡ Resultado personal encontrado en historial — sin llamar a la IA');
    try { require('fs').unlinkSync(rutaUsuario); } catch {}
    try { require('fs').unlinkSync(rutaPrenda);  } catch {}
    return res.json({ status: 'completed', output: [personalCache.rows[0].resultado_url], desde_cache: true });
  }

  const { Client, handle_file } = await import('@gradio/client');
  const garmentType = category === 'bottoms' ? 'lower_body' : category === 'one-pieces' ? 'dresses' : 'upper_body';

  let ultimoError = null;

  // Incluir intento sin token al final (acceso público compartido)
  const intentos = [...HF_TOKENS, null];

  for (let i = 0; i < intentos.length; i++) {
    const token = intentos[i];
    try {
      console.log(`🔄 Intentando con ${token ? `token ${i + 1} de ${HF_TOKENS.length}` : 'acceso público'}...`);
      const client = await Client.connect("franciszzj/Leffa", token ? { hf_token: token } : {});

      const result = await client.predict("/leffa_predict_vt", {
        src_image_path:   handle_file(rutaUsuario),
        ref_image_path:   handle_file(rutaPrenda),
        ref_acceleration: false,
        step:             30,
        scale:            2.5,
        seed:             42,
        vt_model_type:    "viton_hd",
        vt_garment_type:  garmentType,
        vt_repaint:       false,
      });

      const outputImg = result.data[0];
      const imgUrl = outputImg?.url || (typeof outputImg === 'string' ? outputImg : null);

      if (!imgUrl) {
        ultimoError = "La IA no devolvió ninguna imagen";
        continue;
      }

      console.log(`✅ Generación exitosa con token ${i + 1}`);

      // Guardar en caché para futuras búsquedas con la misma prenda
      await pool.query(
        'INSERT INTO busquedas_cache (garment_hash, category, resultado_url) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
        [gHash, cat, imgUrl]
      );

      // Guardar en historial del usuario
      if (email) {
        const usr = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (usr.rows.length > 0) {
          await pool.query(
            'INSERT INTO busquedas_historial (usuario_id, garment_hash, model_hash, category, resultado_url, desde_cache) VALUES ($1,$2,$3,$4,$5,FALSE)',
            [usr.rows[0].id, gHash, mHash, cat, imgUrl]
          );
        }
      }

      try { fs.unlinkSync(rutaUsuario); } catch {}
      try { fs.unlinkSync(rutaPrenda);  } catch {}
      return res.json({ status: 'completed', output: [imgUrl], desde_cache: false });

    } catch (err) {
      const msg = err?.message || JSON.stringify(err);
      const esQuota = msg.includes('quota') || err?.title?.includes('quota');
      const label = token ? `Token ${i + 1}` : 'Acceso público';
      console.log(`⚠️ ${label} ${esQuota ? 'sin cuota' : 'falló'}: ${msg.slice(0, 300)}`);
      ultimoError = esQuota ? 'quota' : msg;
    }
  }

  try { fs.unlinkSync(rutaUsuario); } catch {}
  try { fs.unlinkSync(rutaPrenda);  } catch {}

  // Fallback demo: usar imagen local si existe
  const path2 = require('path');
  const fs2 = require('fs');
  const demoPath1 = path2.join(__dirname, 'demo-result.jpg');
  const demoPath2 = path2.join(__dirname, 'demo-result-2.jpg');
  if (fs2.existsSync(demoPath1)) {
    // Contar cuántas personas distintas han generado ya → asignar imagen en orden
    const personasCount = await pool.query(
      'SELECT COUNT(DISTINCT model_hash) FROM busquedas_historial WHERE garment_hash = $1',
      [gHash]
    );
    const numPersonas = parseInt(personasCount.rows[0].count);
    const usarSegunda = numPersonas >= 1 && fs2.existsSync(demoPath2);
    const imgUrl = usarSegunda
      ? 'http://localhost:3000/demo/demo-result-2.jpg'
      : 'http://localhost:3000/demo/demo-result.jpg';
    console.log(`🎬 Usando imagen demo ${usarSegunda ? '2' : '1'} como fallback (${numPersonas} personas previas)`);

    await pool.query(
      'INSERT INTO busquedas_cache (garment_hash, category, resultado_url) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [gHash, cat, imgUrl]
    );

    if (email) {
      const usr = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
      if (usr.rows.length > 0) {
        await pool.query(
          'INSERT INTO busquedas_historial (usuario_id, garment_hash, model_hash, category, resultado_url, desde_cache) VALUES ($1,$2,$3,$4,$5,FALSE)',
          [usr.rows[0].id, gHash, mHash, cat, imgUrl]
        );
      }
    }

    return res.json({ status: 'completed', output: [imgUrl], desde_cache: false });
  }

  const msgFinal = ultimoError === 'quota'
    ? "Se ha agotado la cuota diaria de generaciones. Inténtalo mañana."
    : "Error al conectar con el modelo de IA";

  return res.status(500).json({ error: msgFinal });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});