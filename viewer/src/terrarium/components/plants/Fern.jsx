import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Individual fern frond
const FernFrond = ({ rotation = [0, 0, 0], length = 0.5 }) => {
  const pinnaeCount = 10

  return (
    <group rotation={rotation}>
      {/* Main stem */}
      <mesh>
        <cylinderGeometry args={[0.004, 0.008, length, 6]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.7} />
      </mesh>

      {/* Pinnae (leaflets) */}
      {Array.from({ length: pinnaeCount }).map((_, i) => {
        const t = (i + 1) / pinnaeCount
        const y = -length / 2 + t * length * 0.9
        const size = 0.03 + (1 - Math.abs(t - 0.5) * 2) * 0.04
        const side = i % 2 === 0 ? -1 : 1

        return (
          <mesh
            key={i}
            position={[side * size * 0.8, y, 0]}
            rotation={[0, 0, side * 0.5]}
            scale={[size * 2, size, 0.5]}
          >
            <sphereGeometry args={[1, 6, 4]} />
            <meshStandardMaterial
              color={`hsl(${120 + Math.random() * 15}, ${55 + Math.random() * 15}%, ${35 + Math.random() * 10}%)`}
              roughness={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Full fern plant
const Fern = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  // Generate frond configurations
  const fronds = useMemo(() => {
    const result = []
    const frondCount = 7
    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2 - Math.PI / 2
      const spread = 0.8 + Math.random() * 0.4
      result.push({
        rotation: [
          -0.3 - Math.random() * 0.3, // Tilt outward
          angle,
          0,
        ],
        length: 0.4 + Math.random() * 0.2,
      })
    }
    return result
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying
      const sway = Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 2) * 0.03
      groupRef.current.rotation.x = sway
      groupRef.current.rotation.z = sway * 0.5
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central crown */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#33691E" roughness={0.8} />
      </mesh>

      {/* Fronds radiating outward */}
      {fronds.map((frond, i) => (
        <group key={i} position={[0, 0.05, 0]}>
          <FernFrond rotation={frond.rotation} length={frond.length} />
        </group>
      ))}
    </group>
  )
}

export default Fern
