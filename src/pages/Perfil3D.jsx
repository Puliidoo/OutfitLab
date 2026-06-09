import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = [
  { value: 'tops', label: '👕 Parte superior (camisetas, chaquetas...)' },
  { value: 'bottoms', label: '👖 Parte inferior (pantalones, faldas...)' },
  { value: 'one-pieces', label: '👗 Conjunto completo (vestidos, monos...)' },
];

export default function Perfil3D() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fotoRef = useRef();
  const prendaRef = useRef();

  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const savedTryon = localStorage.getItem(`tryon_${user?.email}`);
    if (savedTryon) setFotoUsuario(savedTryon);

    const savedHistorial = localStorage.getItem(`historial_${user?.email}`);
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
  }, [user]);
  const [fotoPrenda, setFotoPrenda] = useState(null);
  const [categoria, setCategoria] = useState('tops');
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('idle'); // idle | generando | listo | error
  const [mensajeError, setMensajeError] = useState('');

  const leerArchivo = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleFotoUsuario = async (e) => {
    const file = e.target.files[0];
    if (file) setFotoUsuario(await leerArchivo(file));
  };

  const handleFotoPrenda = async (e) => {
    const file = e.target.files[0];
    if (file) setFotoPrenda(await leerArchivo(file));
  };

  const generarTryOn = async () => {
    if (!fotoUsuario || !fotoPrenda) return;
    setEstado('generando');
    setResultado(null);
    setMensajeError('');

    try {
      const res = await fetch('http://localhost:3000/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_image: fotoUsuario,
          garment_image: fotoPrenda,
          category: categoria,
          email: user?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajeError(data.error || 'Error al generar el resultado');
        setEstado('error');
        return;
      }
      const imgUrl = data.output[0];
      setResultado(imgUrl);
      setEstado('listo');

      // Guardar en base de datos
      await fetch('http://localhost:3000/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          imagen_generada: imgUrl,
          nombre: `Look ${new Date().toLocaleDateString('es-ES')}`,
        }),
      });

      // Guardar también en historial local
      const nuevo = { url: imgUrl, fecha: new Date().toLocaleDateString('es-ES') };
      const nuevoHistorial = [nuevo, ...historial].slice(0, 6);
      setHistorial(nuevoHistorial);
      localStorage.setItem(`historial_${user?.email}`, JSON.stringify(nuevoHistorial));
    } catch {
      setMensajeError('No se puede conectar con el servidor');
      setEstado('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid #2a2a2a' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>OutfitLab</h1>
        <button onClick={() => navigate('/dashboard')} style={btnSecundario}>← Volver al inicio</button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '48px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Probador Virtual</h2>
        <p style={{ color: '#888', marginBottom: '40px' }}>Sube tu foto y la foto de una prenda para ver cómo te quedaría.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          {/* FOTO DEL USUARIO */}
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>1. Tu foto</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '16px' }}>
              {fotoUsuario
                ? 'Foto cargada desde tu perfil. Haz clic para cambiarla.'
                : 'No tienes foto guardada. Súbela aquí o ve a tu Perfil → "Foto del probador".'}
            </p>
            <div
              onClick={() => fotoRef.current.click()}
              style={{ ...zonaSubida, backgroundImage: fotoUsuario ? `url(${fotoUsuario})` : 'none' }}
            >
              {!fotoUsuario && <><span style={{ fontSize: '2.5rem' }}>📷</span><p style={{ color: '#888', marginTop: '8px' }}>Haz clic para subir tu foto</p></>}
              {fotoUsuario && <div style={overlay}>✏️ Cambiar foto</div>}
            </div>
            <input ref={fotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoUsuario} />
          </div>

          {/* FOTO DE LA PRENDA */}
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>2. La prenda</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '16px' }}>
              Sube la foto de la prenda que quieras probar (fondo blanco funciona mejor).
            </p>
            <div
              onClick={() => prendaRef.current.click()}
              style={{ ...zonaSubida, backgroundImage: fotoPrenda ? `url(${fotoPrenda})` : 'none' }}
            >
              {!fotoPrenda && <><span style={{ fontSize: '2.5rem' }}>👕</span><p style={{ color: '#888', marginTop: '8px' }}>Haz clic para subir la prenda</p></>}
              {fotoPrenda && <div style={overlay}>✏️ Cambiar prenda</div>}
            </div>
            <input ref={prendaRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoPrenda} />
          </div>
        </div>

        {/* CATEGORÍA */}
        <div style={{ ...tarjeta, marginBottom: '24px' }}>
          <h3 style={tituloSeccion}>3. Tipo de prenda</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                style={{
                  padding: '10px 18px', borderRadius: '8px', border: '1px solid',
                  borderColor: categoria === cat.value ? '#fff' : '#333',
                  backgroundColor: categoria === cat.value ? '#fff' : 'transparent',
                  color: categoria === cat.value ? '#000' : '#888',
                  cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* BOTÓN GENERAR */}
        <button
          onClick={generarTryOn}
          disabled={!fotoUsuario || !fotoPrenda || estado === 'generando'}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            backgroundColor: fotoUsuario && fotoPrenda && estado !== 'generando' ? 'white' : '#333',
            color: fotoUsuario && fotoPrenda && estado !== 'generando' ? 'black' : '#666',
            fontSize: '1.1rem', fontWeight: '700', cursor: fotoUsuario && fotoPrenda ? 'pointer' : 'not-allowed',
            marginBottom: '32px',
          }}
        >
          {estado === 'generando' ? '⏳ Generando resultado...' : '✨ Probarme esta prenda'}
        </button>

        {/* RESULTADO */}
        {estado === 'generando' && (
          <div style={{ ...tarjeta, alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <p style={{ color: '#888' }}>La IA está generando tu look. Esto puede tardar entre 10 y 30 segundos...</p>
          </div>
        )}

        {estado === 'error' && (
          <div style={{ ...tarjeta, borderColor: '#ff6b6b' }}>
            <p style={{ color: '#ff6b6b' }}>❌ {mensajeError}</p>
            {mensajeError.includes('cuota') && (
              <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '8px' }}>
                La cuota diaria de generaciones se resetea cada 24 horas.
              </p>
            )}
            <button onClick={() => setEstado('idle')} style={{ ...btnSecundario, marginTop: '8px', width: 'fit-content' }}>Volver a intentarlo</button>
          </div>
        )}

        {estado === 'listo' && resultado && (
          <div style={{ ...tarjeta, alignItems: 'center' }}>
            <h3 style={{ ...tituloSeccion, textAlign: 'center' }}>¡Aquí tienes tu look! 🎉</h3>
            <img src={resultado} alt="Resultado try-on" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px', marginTop: '8px' }} />
            <a href={resultado} download="mi-outfit.png" style={{ ...btnSecundario, marginTop: '16px', textDecoration: 'none', textAlign: 'center' }}>
              ⬇️ Descargar imagen
            </a>
          </div>
        )}

        {/* HISTORIAL DE RESULTADOS */}
        {historial.length > 0 && (
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>Mis looks generados</h3>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>Los resultados se guardan aquí para que no tengas que regenerarlos.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginTop: '8px' }}>
              {historial.map((item, i) => (
                <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #2e2e2e', backgroundColor: '#1a1a1a' }}>
                  <img src={item.url} alt={`Look ${i + 1}`} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.75rem' }}>{item.fecha}</span>
                    <a href={item.url} download={`look-${i + 1}.png`} style={{ color: '#888', fontSize: '0.75rem', textDecoration: 'none' }}>⬇️</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const tarjeta = { backgroundColor: '#1e1e1e', borderRadius: '16px', border: '1px solid #2e2e2e', padding: '24px', display: 'flex', flexDirection: 'column' };
const tituloSeccion = { fontSize: '1rem', fontWeight: '700', color: '#ddd', marginBottom: '4px' };
const zonaSubida = {
  height: '220px', borderRadius: '12px', border: '2px dashed #333', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden',
  marginTop: '8px',
};
const overlay = {
  position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1rem', color: 'white',
};
const btnSecundario = { padding: '8px 18px', backgroundColor: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };
