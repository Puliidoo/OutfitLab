import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';

function AvatarHumano() {
  // Material tipo maniquí mate para no saturar la GPU
  const matPiel = { color: "#d2b48c", roughness: 1, metalness: 0 };

  return (
    <group position={[0, -1, 0]}>
      {/* Cabeza anatómica */}
      <mesh position={[0, 2.85, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial {...matPiel} />
      </mesh>
      
      {/* Torso (Base para camisetas y chaquetas) */}
      <mesh position={[0, 2.1, 0]}>
        <capsuleGeometry args={[0.2, 0.7, 10, 20]} />
        <meshStandardMaterial {...matPiel} />
      </mesh>
      
      {/* Brazos en Pose A (Evita colisiones con la ropa) */}
      <group>
        <mesh position={[-0.45, 2.2, 0]} rotation={[0, 0, 0.25]}>
          <capsuleGeometry args={[0.06, 0.8, 8, 20]} />
          <meshStandardMaterial {...matPiel} />
        </mesh>
        <mesh position={[0.45, 2.2, 0]} rotation={[0, 0, -0.25]}>
          <capsuleGeometry args={[0.06, 0.8, 8, 20]} />
          <meshStandardMaterial {...matPiel} />
        </mesh>
      </group>

      {/* Piernas (Base para pantalones) */}
      <group>
        <mesh position={[-0.18, 0.9, 0]}>
          <capsuleGeometry args={[0.09, 1.25, 8, 20]} />
          <meshStandardMaterial {...matPiel} />
        </mesh>
        <mesh position={[0.18, 0.9, 0]}>
          <capsuleGeometry args={[0.09, 1.25, 8, 20]} />
          <meshStandardMaterial {...matPiel} />
        </mesh>
      </group>

      {/* Pies (Hormas para calzado Nike/Adidas) */}
      <mesh position={[-0.18, 0.08, 0.08]}>
        <boxGeometry args={[0.11, 0.08, 0.28]} />
        <meshStandardMaterial {...matPiel} />
      </mesh>
      <mesh position={[0.18, 0.08, 0.08]}>
        <boxGeometry args={[0.11, 0.08, 0.28]} />
        <meshStandardMaterial {...matPiel} />
      </mesh>
    </group>
  );
}

export default function Perfil3D() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f5f5f5', overflow: 'hidden' }}>
      
      {/* Visor 3D estable */}
      <div style={{ flex: 2, position: 'relative' }}>
        <Suspense fallback={null}>
          <Canvas 
            shadows 
            camera={{ position: [0, 1.5, 4.5], fov: 40 }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            
            <AvatarHumano />
            
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} />
            <OrbitControls enablePan={false} target={[0, 1.2, 0]} minDistance={2} maxDistance={6} />
            
            {/* Preset 'city' para evitar errores de iluminación en consola */}
            <Environment preset="city" /> 
          </Canvas>
        </Suspense>
      </div>

      {/* Panel de Control Lateral */}
      <div style={{ flex: 1, padding: '40px', background: '#fff', borderLeft: '1px solid #eee' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Outfit Lab</h2>
        <p style={{ color: '#888', marginBottom: '30px' }}>Simulador de prendas externas.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={slotStyle}><span>👕 Capa Superior</span> <button style={btnStyle}>Vincular</button></div>
            <div style={slotStyle}><span>👖 Capa Inferior</span> <button style={btnStyle}>Vincular</button></div>
            <div style={slotStyle}><span>👟 Calzado Nike</span> <button style={btnStyle}>Vincular</button></div>
        </div>
      </div>
    </div>
  );
}

const slotStyle = { padding: '15px', background: '#fcfcfc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', border: '1px solid #f0f0f0', alignItems: 'center' };
const btnStyle = { padding: '6px 12px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' };