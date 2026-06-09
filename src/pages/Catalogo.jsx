import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTOS = [
  { id: 1,  nombre: 'Air Force 1 Low',    marca: 'Nike',         precio: 109.99, categoria: 'Zapatillas', emoji: '👟', bg: '#1a1a2e' },
  { id: 2,  nombre: 'Camiseta Dri-FIT',   marca: 'Nike',         precio: 34.99,  categoria: 'Camisetas',  emoji: '👕', bg: '#16213e' },
  { id: 3,  nombre: 'Ultraboost 22',      marca: 'Adidas',       precio: 189.99, categoria: 'Zapatillas', emoji: '👟', bg: '#0f3460' },
  { id: 4,  nombre: 'Tiro Track Pants',   marca: 'Adidas',       precio: 49.99,  categoria: 'Pantalones', emoji: '👖', bg: '#1d3557' },
  { id: 5,  nombre: 'Stan Smith',         marca: 'Adidas',       precio: 99.99,  categoria: 'Zapatillas', emoji: '👟', bg: '#2b2d42' },
  { id: 6,  nombre: 'Camiseta básica',    marca: 'Zara',         precio: 19.99,  categoria: 'Camisetas',  emoji: '👕', bg: '#3a0ca3' },
  { id: 7,  nombre: 'Pantalón chino',     marca: 'Zara',         precio: 39.99,  categoria: 'Pantalones', emoji: '👖', bg: '#480ca8' },
  { id: 8,  nombre: 'Vestido floral',     marca: 'Zara',         precio: 45.99,  categoria: 'Vestidos',   emoji: '👗', bg: '#7209b7' },
  { id: 9,  nombre: 'Slim Fit Jeans',     marca: "Levi's",       precio: 79.99,  categoria: 'Vaqueros',   emoji: '👖', bg: '#023e8a' },
  { id: 10, nombre: 'Hoodie Classic',     marca: 'H&M',          precio: 29.99,  categoria: 'Sudaderas',  emoji: '🧥', bg: '#457b9d' },
  { id: 11, nombre: 'Polo Classic Fit',   marca: 'Ralph Lauren', precio: 89.99,  categoria: 'Polos',      emoji: '👕', bg: '#2d6a4f' },
  { id: 12, nombre: 'Chaqueta Bomber',    marca: 'Bershka',      precio: 59.99,  categoria: 'Chaquetas',  emoji: '🧥', bg: '#40916c' },
  { id: 13, nombre: 'Sudadera Puma ESS',  marca: 'Puma',         precio: 54.99,  categoria: 'Sudaderas',  emoji: '🧥', bg: '#6a040f' },
  { id: 14, nombre: 'Camiseta Champion',  marca: 'Champion',     precio: 44.99,  categoria: 'Camisetas',  emoji: '👕', bg: '#9b2226' },
  { id: 15, nombre: 'Polo Lacoste',       marca: 'Lacoste',      precio: 119.99, categoria: 'Polos',      emoji: '👕', bg: '#1b4332' },
];

const MARCAS = ['Todas', ...Array.from(new Set(PRODUCTOS.map(p => p.marca)))];

const getCarrito = () => JSON.parse(localStorage.getItem('carrito_outfitlab') || '[]');
const saveCarrito = (items) => localStorage.setItem('carrito_outfitlab', JSON.stringify(items));

export default function Catalogo() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('Todas');
  const [carrito, setCarrito] = useState(getCarrito());
  const [toast, setToast] = useState(null);

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  const productosFiltrados = filtro === 'Todas'
    ? PRODUCTOS
    : PRODUCTOS.filter(p => p.marca === filtro);

  const añadirAlCarrito = (producto) => {
    const items = getCarrito();
    const existe = items.findIndex(i => i.id === producto.id);
    if (existe >= 0) {
      items[existe].cantidad += 1;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }
    saveCarrito(items);
    setCarrito(items);
    setToast(`${producto.nombre} añadido al carrito`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #2a2a2a',
        position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={btnSec}>← Volver</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Catálogo</h1>
        </div>
        <button onClick={() => navigate('/carrito')} style={{ ...btnSec, position: 'relative', fontSize: '1.2rem' }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              backgroundColor: 'white', color: 'black',
              borderRadius: '50%', width: '18px', height: '18px',
              fontSize: '0.7rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* FILTROS DE MARCA */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {MARCAS.map(marca => (
            <button
              key={marca}
              onClick={() => setFiltro(marca)}
              style={{
                padding: '8px 18px', borderRadius: '20px', border: '1px solid',
                borderColor: filtro === marca ? 'white' : '#444',
                backgroundColor: filtro === marca ? 'white' : 'transparent',
                color: filtro === marca ? 'black' : '#aaa',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {marca}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {productosFiltrados.map(producto => (
            <div key={producto.id} style={{
              backgroundColor: '#1e1e1e', borderRadius: '16px',
              border: '1px solid #2e2e2e', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Imagen del producto */}
              <div style={{
                backgroundColor: producto.bg, height: '180px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '4rem' }}>{producto.emoji}</span>
              </div>

              {/* Info */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase' }}>
                  {producto.marca}
                </span>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', lineHeight: 1.3 }}>
                  {producto.nombre}
                </h3>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{producto.categoria}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                    {producto.precio.toFixed(2)} €
                  </span>
                  <button
                    onClick={() => añadirAlCarrito(producto)}
                    style={{
                      padding: '8px 14px', backgroundColor: 'white', color: 'black',
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.85rem', fontWeight: '600',
                    }}
                  >
                    + Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1e1e1e', border: '1px solid #444', color: 'white',
          padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 200,
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

const btnSec = {
  padding: '8px 16px', backgroundColor: 'transparent', color: '#ccc',
  border: '1px solid #444', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.9rem', position: 'relative',
};
