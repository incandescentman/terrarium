import { useMemo } from 'react'
import * as THREE from 'three'

// Individual rock with slight randomization
const Rock = ({ position, scale = 1, color = '#5D4037' }) => {
  const randomSeed = useMemo(() => Math.random(), [])

  return (
    <group position={position}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1, 0.75, 1]}>
        <circleGeometry args={[scale * 0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Main rock body */}
      <mesh castShadow position={[0, scale * 0.15, 0]}>
        <dodecahedronGeometry args={[scale * 0.25, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Secondary bump */}
      <mesh castShadow position={[scale * 0.1, scale * 0.2, scale * 0.05]}>
        <dodecahedronGeometry args={[scale * 0.15, 0]} />
        <meshStandardMaterial
          color={new THREE.Color(color).offsetHSL(0, 0, 0.1).getStyle()}
          roughness={0.8}
          flatShading
        />
      </mesh>

      {/* Highlight */}
      <mesh position={[-scale * 0.05, scale * 0.28, scale * 0.08]}>
        <sphereGeometry args={[scale * 0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

// Rock cluster component
const Rocks = () => {
  const rockConfigs = useMemo(() => [
    { position: [0.5, 0, 0.8], scale: 1.2, color: '#5D4037' },
    { position: [1.8, 0, 1.2], scale: 0.8, color: '#4E342E' },
    { position: [-4.2, 0, -0.5], scale: 0.6, color: '#5D4037' },
    { position: [3.5, 0, 0.3], scale: 0.7, color: '#6D4C41' },
    { position: [-1, 0, 2.2], scale: 0.5, color: '#4E342E' },
  ], [])

  return (
    <group>
      {rockConfigs.map((config, i) => (
        <Rock key={i} {...config} />
      ))}
    </group>
  )
}

export default Rocks
