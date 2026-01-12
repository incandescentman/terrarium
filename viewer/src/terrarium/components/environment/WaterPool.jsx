import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTerrariumStore } from '../../store/terrariumStore'

// Animated water pool with ripples
const WaterPool = ({ position = [-2.2, 0.02, 1.5], size = [1.8, 1.2] }) => {
  const waterRef = useRef()
  const ripples = useTerrariumStore(state => state.ripples)

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle wave animation via vertex displacement would go here
      // For now we animate opacity slightly for shimmer effect
      const time = state.clock.elapsedTime
      waterRef.current.material.opacity = 0.75 + Math.sin(time * 2) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Pool depression in ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} scale={[1, size[1] / size[0], 1]}>
        <circleGeometry args={[size[0] * 0.55, 32]} />
        <meshStandardMaterial color="#1a0f0a" roughness={1} />
      </mesh>

      {/* Water surface */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} scale={[1, size[1] / size[0], 1]}>
        <circleGeometry args={[size[0] * 0.5, 32]} />
        <meshPhysicalMaterial
          color="#1976D2"
          metalness={0.1}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          ior={1.33}
          transparent
          opacity={0.8}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Water surface highlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.2, 0.01, -0.1]} scale={[1, 0.6, 1]}>
        <circleGeometry args={[size[0] * 0.25, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      {/* Ripples */}
      {ripples.map(ripple => (
        <mesh
          key={ripple.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[ripple.x - position[0], 0.02, ripple.z - position[2]]}
        >
          <ringGeometry args={[ripple.size * 0.08, ripple.size * 0.1, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={ripple.opacity * 0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

export default WaterPool
