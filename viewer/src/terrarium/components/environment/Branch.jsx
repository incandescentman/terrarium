import { useMemo } from 'react'
import * as THREE from 'three'

// Curved branch/log using tube geometry
const Branch = () => {
  // Create a curved path for the branch
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0.1, 0.8),
      new THREE.Vector3(0, 0.4, 0.3),
      new THREE.Vector3(1, 0.5, -0.2),
      new THREE.Vector3(2.5, 0.45, -0.3),
    ])
  }, [])

  // Secondary branch curve
  const secondaryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 0.45, 0.1),
      new THREE.Vector3(0.3, 0.8, -0.5),
      new THREE.Vector3(0, 1.2, -0.8),
    ])
  }, [])

  return (
    <group>
      {/* Shadow under branch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0.3]}>
        <planeGeometry args={[3.5, 0.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>

      {/* Main branch */}
      <mesh castShadow>
        <tubeGeometry args={[curve, 32, 0.08, 12, false]} />
        <meshStandardMaterial
          color="#4E342E"
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Bark detail layer */}
      <mesh>
        <tubeGeometry args={[curve, 32, 0.085, 12, false]} />
        <meshStandardMaterial
          color="#6D4C41"
          roughness={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Secondary branch */}
      <mesh castShadow>
        <tubeGeometry args={[secondaryCurve, 20, 0.04, 8, false]} />
        <meshStandardMaterial
          color="#5D4037"
          roughness={0.85}
        />
      </mesh>

      {/* Small branch nubs */}
      <mesh castShadow position={[1.5, 0.5, -0.25]} rotation={[0.3, 0, 0.5]}>
        <coneGeometry args={[0.03, 0.12, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[-0.5, 0.25, 0.5]} rotation={[-0.5, 0, -0.3]}>
        <coneGeometry args={[0.025, 0.1, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.85} />
      </mesh>
    </group>
  )
}

export default Branch
