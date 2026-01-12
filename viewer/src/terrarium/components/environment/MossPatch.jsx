import { useMemo } from 'react'
import * as THREE from 'three'

// Individual moss tuft
const MossTuft = ({ position, scale = 1 }) => {
  return (
    <mesh position={position} scale={[scale, scale * 0.6, scale]}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial
        color={`hsl(${115 + Math.random() * 20}, ${50 + Math.random() * 20}%, ${35 + Math.random() * 15}%)`}
        roughness={0.9}
      />
    </mesh>
  )
}

// Moss patch made of many small tufts
const MossPatch = ({ position, radius = 0.5, density = 40 }) => {
  const tufts = useMemo(() => {
    const result = []
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * radius
      result.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.6 + Math.random() * 0.8,
      })
    }
    return result
  }, [radius, density])

  return (
    <group position={position}>
      {/* Base disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[radius, 16]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.95} />
      </mesh>

      {/* Moss tufts */}
      {tufts.map((tuft, i) => (
        <MossTuft
          key={i}
          position={[tuft.x, 0.02, tuft.z]}
          scale={tuft.scale}
        />
      ))}
    </group>
  )
}

// Multiple moss patches
const MossPatches = () => {
  const patches = useMemo(() => [
    { position: [1, 0, -0.5], radius: 0.6, density: 45 },
    { position: [-1.5, 0, 0.8], radius: 0.4, density: 30 },
    { position: [3, 0, 1.5], radius: 0.5, density: 35 },
    { position: [-3.5, 0, -0.3], radius: 0.35, density: 25 },
  ], [])

  return (
    <group>
      {patches.map((patch, i) => (
        <MossPatch key={i} {...patch} />
      ))}
    </group>
  )
}

export default MossPatches
