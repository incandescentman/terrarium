import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Creates a monstera leaf shape
const createMonsteraShape = () => {
  const shape = new THREE.Shape()

  // Main leaf outline
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-0.15, 0.1, -0.25, 0.3, -0.2, 0.5)
  shape.bezierCurveTo(-0.15, 0.7, -0.1, 0.85, 0, 0.95)
  shape.bezierCurveTo(0.1, 0.85, 0.15, 0.7, 0.2, 0.5)
  shape.bezierCurveTo(0.25, 0.3, 0.15, 0.1, 0, 0)

  // Holes (characteristic monstera fenestrations)
  const hole1 = new THREE.Path()
  hole1.moveTo(-0.08, 0.4)
  hole1.bezierCurveTo(-0.12, 0.45, -0.12, 0.55, -0.08, 0.6)
  hole1.bezierCurveTo(-0.04, 0.55, -0.04, 0.45, -0.08, 0.4)
  shape.holes.push(hole1)

  const hole2 = new THREE.Path()
  hole2.moveTo(0.06, 0.5)
  hole2.bezierCurveTo(0.1, 0.55, 0.1, 0.62, 0.06, 0.67)
  hole2.bezierCurveTo(0.02, 0.62, 0.02, 0.55, 0.06, 0.5)
  shape.holes.push(hole2)

  return shape
}

const MonsteraLeaf = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()
  const shape = useMemo(() => createMonsteraShape(), [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying
      const sway = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
      groupRef.current.rotation.z = rotation[2] + sway
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.7} />
      </mesh>

      {/* Leaf */}
      <mesh castShadow receiveShadow rotation={[0.2, 0, 0]}>
        <extrudeGeometry
          args={[
            shape,
            { depth: 0.01, bevelEnabled: false }
          ]}
        />
        <meshPhysicalMaterial
          color="#388E3C"
          roughness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central vein */}
      <mesh position={[0, 0.45, 0.01]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.008, 0.85, 0.005]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.6} />
      </mesh>

      {/* Highlight/wet sheen */}
      <mesh position={[0, 0.5, 0.015]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[0.15, 0.25]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Group of monstera leaves
const MonsteraPlant = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <MonsteraLeaf position={[0, 0.5, 0]} rotation={[-0.3, 0, -0.2]} scale={0.8} />
      <MonsteraLeaf position={[0.15, 0.4, 0.1]} rotation={[-0.2, 0.5, 0.1]} scale={0.6} />
      <MonsteraLeaf position={[-0.1, 0.35, 0.15]} rotation={[-0.4, -0.3, -0.1]} scale={0.5} />
    </group>
  )
}

export { MonsteraLeaf, MonsteraPlant }
export default MonsteraLeaf
