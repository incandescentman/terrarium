import { useMemo } from 'react'
import * as THREE from 'three'

// Glass terrarium enclosure with subtle reflections
const GlassTank = ({ size = [10, 4, 6] }) => {
  const [width, height, depth] = size

  return (
    <group>
      {/* Front glass panel - very subtle */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={0.98}
          thickness={0.05}
          ior={1.5}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Glass reflections/highlights on edges */}
      <mesh position={[-width / 2, height / 2, depth / 4]}>
        <planeGeometry args={[0.02, height]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      <mesh position={[width / 2, height / 2, depth / 4]}>
        <planeGeometry args={[0.02, height]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Top edge highlight */}
      <mesh position={[0, height, depth / 4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth / 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
      </mesh>

      {/* Vignette corners (darker) */}
      <mesh position={[-width / 2 + 0.5, height / 2, depth / 2]}>
        <planeGeometry args={[1, height]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[width / 2 - 0.5, height / 2, depth / 2]}>
        <planeGeometry args={[1, height]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default GlassTank
