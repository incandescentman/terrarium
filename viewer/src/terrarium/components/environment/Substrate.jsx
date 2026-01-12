import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Ground substrate with procedural texture variation
const Substrate = () => {
  // Create scattered debris/pebbles on the substrate
  const debrisPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 60; i++) {
      positions.push({
        x: -4.5 + Math.random() * 9,
        z: -2.5 + Math.random() * 5.5,
        scale: 0.02 + Math.random() * 0.04,
        color: `hsl(${20 + Math.random() * 20}, ${30 + Math.random() * 20}%, ${15 + Math.random() * 15}%)`,
      })
    }
    return positions
  }, [])

  return (
    <group>
      {/* Main ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial
          color="#3E2723"
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Slightly raised center area */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color="#4E342E"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Debris/pebbles */}
      {debrisPositions.map((debris, i) => (
        <mesh
          key={i}
          position={[debris.x, debris.scale / 2, debris.z]}
          scale={[debris.scale * 1.5, debris.scale, debris.scale]}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color={debris.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default Substrate
