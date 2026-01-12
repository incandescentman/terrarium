import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTerrariumStore } from '../../store/terrariumStore'

// Individual firefly with glow effect
const Firefly = ({ fireflyData }) => {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    // Slower, more subtle pulsing
    const glow = 0.2 + 0.8 * Math.abs(Math.sin(fireflyData.phase + time * 0.4 * fireflyData.speed))

    if (meshRef.current) {
      meshRef.current.position.set(fireflyData.x, fireflyData.y, fireflyData.z)
      meshRef.current.material.opacity = glow
      // Much smaller - tiny points of light
      meshRef.current.scale.setScalar(0.008 + glow * 0.006)
    }

    if (glowRef.current) {
      glowRef.current.position.set(fireflyData.x, fireflyData.y, fireflyData.z)
      glowRef.current.material.opacity = glow * 0.3
      // Smaller glow halo
      glowRef.current.scale.setScalar(0.03 + glow * 0.025)
    }
  })

  return (
    <group>
      {/* Glow halo */}
      <sprite ref={glowRef}>
        <spriteMaterial
          color="#FFFFA0"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Core light */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#FFFFCC"
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  )
}

// All fireflies
const Fireflies = () => {
  const fireflies = useTerrariumStore(state => state.fireflies)

  return (
    <group>
      {fireflies.map(firefly => (
        <Firefly key={firefly.id} fireflyData={firefly} />
      ))}
    </group>
  )
}

export default Fireflies
