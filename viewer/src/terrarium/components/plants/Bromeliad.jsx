import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Individual bromeliad leaf
const BromeliadLeaf = ({ rotation, length = 0.3, width = 0.04 }) => {
  // Create curved leaf shape
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, length * 0.6, length * 0.3),
      new THREE.Vector3(0, length, length * 0.1)
    )
  }, [length])

  return (
    <group rotation={rotation}>
      <mesh castShadow>
        <tubeGeometry args={[curve, 12, width, 6, false]} />
        <meshPhysicalMaterial
          color="#7B1FA2"
          roughness={0.5}
          clearcoat={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Green tip */}
      <mesh position={[0, length * 0.9, length * 0.12]}>
        <sphereGeometry args={[width * 0.8, 6, 6]} />
        <meshStandardMaterial color="#388E3C" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Full bromeliad plant
const Bromeliad = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  // Generate leaf configurations in a rosette pattern
  const leaves = useMemo(() => {
    const result = []
    const leafCount = 8
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2
      const tilt = 0.4 + (i % 2) * 0.2 // Alternating tilt
      result.push({
        rotation: [tilt, angle, 0],
        length: 0.25 + Math.random() * 0.1,
        width: 0.025 + Math.random() * 0.015,
      })
    }
    return result
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      const sway = Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.02
      groupRef.current.rotation.z = sway
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central cup/base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.04, 12]} />
        <meshStandardMaterial color="#4A148C" roughness={0.7} />
      </mesh>

      {/* Water in cup */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 12]} />
        <meshPhysicalMaterial
          color="#1565C0"
          roughness={0.1}
          transmission={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <BromeliadLeaf key={i} {...leaf} />
      ))}
    </group>
  )
}

export default Bromeliad
