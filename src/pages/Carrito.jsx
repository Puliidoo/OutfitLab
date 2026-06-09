import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getCarrito = () => JSON.parse(localStorage.getItem('carrito_outfitlab') || '[]');
const saveCarrito = (items) => localStorage.setItem('carrito_outfitlab', JSON.stringify(items));

const ENVIO_GRATIS_DESDE = 100;

export default function Carrito() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState(getCarrito());
  const [paso, setPaso] = useState('carrito'); // carrito | checkout | exito
  const [form, setForm] = useState({
    nombre: user?.name || '',
    email: user?.email || '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    tarjeta: '',
    caducidad: '',
    cvv: '',
  });
  const [errores, setErrores] = useState({});
  const [pedidoNum] = useState(() => Math.floor(Math.random() * 900000) + 100000);

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : 4.99;
  const total = subtotal + envio;

  const cambiarCantidad = (id, delta) => {
    const nuevos = items.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i);
    saveCarrito(nuevos);
    setItems(nuevos);
  };

  const eliminar = (id) => {
    const nuevos = items.filter(i => i.id !== id);
    saveCarrito(nuevos);
    setItems(nuevos);
  };

  const validarCheckout = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Campo obligatorio';
    if (!form.email.trim()) e.email = 'Campo obligatorio';
    if (!form.direccion.trim()) e.direccion = 'Campo obligatorio';
    if (!form.ciudad.trim()) e.ciudad = 'Campo obligatorio';
    if (!form.codigoPostal.trim()) e.codigoPostal = 'Campo obligatorio';
    if (form.tarjeta.replace(/\s/g, '').length < 16) e.tarjeta = 'Introduce 16 dígitos';
    if (!form.caducidad.match(/^\d{2}\/\d{2}$/)) e.caducidad = 'Formato MM/AA';
    if (form.cvv.length < 3) e.cvv = '3 dígitos';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const confirmarPedido = () => {
    if (!validarCheckout()) return;
    saveCarrito([]);
    setItems([]);
    setPaso('exito');
  };

  const formatTarjeta = (val) => {
    const nums = val.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatCaducidad = (val) => {
    const nums = val.replace(/\D/g, '').slice(0, 4);
    if (nums.length >= 3) return nums.slice(0, 2) + '/' + nums.slice(2);
    return nums;
  };

  // --- PASO: ÉXITO ---
  if (paso === 'exito') {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>¡Pedido confirmado!</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>
            Tu pedido <strong style={{ color: 'white' }}>#{pedidoNum}</strong> ha sido recibido.<br />
            Recibirás un email de confirmación en <strong style={{ color: 'white' }}>{form.email}</strong>.
          </p>
          <div style={{ ...tarjeta, textAlign: 'left', marginBottom: '24px' }}>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '8px' }}>Entrega estimada</p>
            <p style={{ fontWeight: '600' }}>
              {(() => {
                const d = new Date();
                d.setDate(d.getDate() + 4);
                return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
              })()}
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '12px', marginBottom: '4px' }}>Dirección de entrega</p>
            <p style={{ fontWeight: '500' }}>{form.direccion}, {form.ciudad} {form.codigoPostal}</p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '12px', marginBottom: '4px' }}>Total pagado</p>
            <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>{total.toFixed(2)} €</p>
          </div>
          <button onClick={() => navigate('/catalogo')} style={btnPrimario}>Seguir comprando</button>
          <button onClick={() => navigate('/dashboard')} style={{ ...btnSec, marginTop: '12px', display: 'block', width: '100%' }}>Ir al inicio</button>
        </div>
      </div>
    );
  }

  // --- PASO: CHECKOUT ---
  if (paso === 'checkout') {
    return (
      <div style={pageStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #2a2a2a' }}>
          <button onClick={() => setPaso('carrito')} style={btnSec}>← Volver al carrito</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Finalizar compra</h1>
          <div />
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>

          {/* FORMULARIO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={tarjeta}>
              <h3 style={secTitle}>Datos de entrega</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { key: 'nombre',       label: 'Nombre completo',  placeholder: 'Carlos García',          full: true },
                  { key: 'email',        label: 'Email',            placeholder: 'carlos@email.com',       full: true },
                  { key: 'direccion',    label: 'Dirección',        placeholder: 'Calle Mayor 10, 2º A',   full: true },
                  { key: 'ciudad',       label: 'Ciudad',           placeholder: 'Madrid' },
                  { key: 'codigoPostal', label: 'Código postal',    placeholder: '28001' },
                  { key: 'pais',         label: 'País',             placeholder: 'España' },
                ].map(({ key, label, placeholder, full }) => (
                  <div key={key} style={{ gridColumn: full ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: '#aaa', fontSize: '0.8rem' }}>{label}</label>
                    <input
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={{ ...inputStyle, borderColor: errores[key] ? '#ff6b6b' : '#333' }}
                    />
                    {errores[key] && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errores[key]}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={tarjeta}>
              <h3 style={secTitle}>Datos de pago</h3>
              <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '16px' }}>Entorno de demostración — no se realizará ningún cargo real.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Número de tarjeta</label>
                  <input
                    value={form.tarjeta}
                    onChange={e => setForm({ ...form, tarjeta: formatTarjeta(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={{ ...inputStyle, borderColor: errores.tarjeta ? '#ff6b6b' : '#333', letterSpacing: '2px' }}
                  />
                  {errores.tarjeta && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errores.tarjeta}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: '#aaa', fontSize: '0.8rem' }}>Caducidad</label>
                    <input
                      value={form.caducidad}
                      onChange={e => setForm({ ...form, caducidad: formatCaducidad(e.target.value) })}
                      placeholder="MM/AA"
                      maxLength={5}
                      style={{ ...inputStyle, borderColor: errores.caducidad ? '#ff6b6b' : '#333' }}
                    />
                    {errores.caducidad && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errores.caducidad}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: '#aaa', fontSize: '0.8rem' }}>CVV</label>
                    <input
                      value={form.cvv}
                      onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      placeholder="123"
                      maxLength={3}
                      style={{ ...inputStyle, borderColor: errores.cvv ? '#ff6b6b' : '#333' }}
                    />
                    {errores.cvv && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errores.cvv}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN */}
          <div>
            <div style={{ ...tarjeta, position: 'sticky', top: '100px' }}>
              <h3 style={secTitle}>Resumen del pedido</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{i.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '500' }}>{i.nombre}</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>x{i.cantidad}</p>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{(i.precio * i.cantidad).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={lineaTotal}><span style={{ color: '#888' }}>Subtotal</span><span>{subtotal.toFixed(2)} €</span></div>
                <div style={lineaTotal}>
                  <span style={{ color: '#888' }}>Envío</span>
                  <span style={{ color: envio === 0 ? '#4ade80' : 'white' }}>{envio === 0 ? 'GRATIS' : `${envio.toFixed(2)} €`}</span>
                </div>
                <div style={{ ...lineaTotal, borderTop: '1px solid #2a2a2a', paddingTop: '12px', fontSize: '1.1rem', fontWeight: '700' }}>
                  <span>Total</span><span>{total.toFixed(2)} €</span>
                </div>
              </div>
              <button onClick={confirmarPedido} style={{ ...btnPrimario, marginTop: '20px', width: '100%' }}>
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PASO: CARRITO ---
  if (items.length === 0) {
    return (
      <div style={{ ...pageStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <span style={{ fontSize: '4rem' }}>🛒</span>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Tu carrito está vacío</h2>
        <p style={{ color: '#888' }}>Explora el catálogo y añade prendas para verlas aquí.</p>
        <button onClick={() => navigate('/catalogo')} style={btnPrimario}>Ir al catálogo</button>
        <button onClick={() => navigate('/dashboard')} style={btnSec}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #2a2a2a' }}>
        <button onClick={() => navigate('/dashboard')} style={btnSec}>← Inicio</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Mi carrito</h1>
        <button onClick={() => navigate('/catalogo')} style={btnSec}>Seguir comprando</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>

        {/* LISTA DE ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ ...tarjeta, flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '12px',
                backgroundColor: item.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '2rem', flexShrink: 0,
              }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>{item.marca}</p>
                <p style={{ margin: '4px 0', fontWeight: '600' }}>{item.nombre}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{item.categoria}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => cambiarCantidad(item.id, -1)} style={btnCantidad}>−</button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>{item.cantidad}</span>
                <button onClick={() => cambiarCantidad(item.id, +1)} style={btnCantidad}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{(item.precio * item.cantidad).toFixed(2)} €</p>
                <p style={{ margin: '2px 0 0', color: '#555', fontSize: '0.75rem' }}>{item.precio.toFixed(2)} € / ud.</p>
              </div>
              <button onClick={() => eliminar(item.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>🗑️</button>
            </div>
          ))}
        </div>

        {/* RESUMEN */}
        <div>
          <div style={{ ...tarjeta, position: 'sticky', top: '100px' }}>
            <h3 style={secTitle}>Resumen del pedido</h3>

            {subtotal < ENVIO_GRATIS_DESDE && (
              <div style={{ backgroundColor: '#1a2a1a', border: '1px solid #2d5a2d', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                <p style={{ margin: 0, color: '#4ade80', fontSize: '0.8rem' }}>
                  Añade {(ENVIO_GRATIS_DESDE - subtotal).toFixed(2)} € más para envío gratis
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={lineaTotal}><span style={{ color: '#888' }}>Subtotal ({items.reduce((a, i) => a + i.cantidad, 0)} artículos)</span><span>{subtotal.toFixed(2)} €</span></div>
              <div style={lineaTotal}>
                <span style={{ color: '#888' }}>Envío</span>
                <span style={{ color: envio === 0 ? '#4ade80' : 'white' }}>{envio === 0 ? 'GRATIS' : `${envio.toFixed(2)} €`}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '16px', ...lineaTotal, fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
              <span>Total</span><span>{total.toFixed(2)} €</span>
            </div>

            <button onClick={() => setPaso('checkout')} style={{ ...btnPrimario, width: '100%' }}>
              Finalizar compra →
            </button>
            <p style={{ color: '#555', fontSize: '0.75rem', textAlign: 'center', marginTop: '12px' }}>
              Pago seguro simulado · Devoluciones gratis 30 días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' };
const tarjeta = { backgroundColor: '#1e1e1e', borderRadius: '16px', border: '1px solid #2e2e2e', padding: '20px', display: 'flex', flexDirection: 'column' };
const secTitle = { fontSize: '1rem', fontWeight: '700', color: '#ddd', marginBottom: '16px', marginTop: 0 };
const lineaTotal = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const btnPrimario = { padding: '14px 24px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' };
const btnSec = { padding: '8px 16px', backgroundColor: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };
const btnCantidad = { width: '28px', height: '28px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const inputStyle = { backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
