import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural stylized turtle geometry
// Creates a cute Pixar-style box turtle

const TurtleGeometry = ({ headOut, legPhase }) => {
  const legMove = Math.sin(legPhase) * 0.15

  return (
    <group>
      {/* Shell base (bottom) */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>

      {/* Shell dome (top) */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.7} />
      </mesh>

      {/* Shell pattern - scutes */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.75} />
      </mesh>
      {/* Ring of scutes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.22,
            0.28,
            Math.cos((angle * Math.PI) / 180) * 0.22,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#5D4037" roughness={0.75} />
        </mesh>
      ))}

      {/* Shell highlight */}
      <mesh position={[-0.1, 0.4, 0.1]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.15, 0.35 + headOut * 0.15]} scale={[1, 1, headOut * 0.5 + 0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshPhysicalMaterial
            color="#7CB342"
            roughness={0.5}
            clearcoat={0.4}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.05, 0.04, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        <mesh position={[0.05, 0.04, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.055, 0.05, 0.1]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.045, 0.05, 0.1]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Nostrils */}
        <mesh position={[0.02, 0, 0.11]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial color="#33691E" />
        </mesh>
        <mesh position={[-0.02, 0, 0.11]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial color="#33691E" />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, 0.1, -0.38]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshPhysicalMaterial color="#7CB342" roughness={0.5} />
      </mesh>

      {/* Front right leg */}
      <group position={[0.28, 0.08, 0.15]} rotation={[0, 0.3 + legMove, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.15, 8, 8]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.5} clearcoat={0.3} />
        </mesh>
        {/* Foot */}
        <mesh position={[0.08, -0.08, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshPhysicalMaterial color="#689F38" roughness={0.6} />
        </mesh>
      </group>

      {/* Front left leg */}
      <group position={[-0.28, 0.08, 0.15]} rotation={[0, -0.3 - legMove, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.15, 8, 8]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.5} clearcoat={0.3} />
        </mesh>
        <mesh position={[-0.08, -0.08, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshPhysicalMaterial color="#689F38" roughness={0.6} />
        </mesh>
      </group>

      {/* Back right leg */}
      <group position={[0.25, 0.08, -0.2]} rotation={[0, -0.2 - legMove, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.055, 0.12, 8, 8]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.5} clearcoat={0.3} />
        </mesh>
        <mesh position={[0.06, -0.07, -0.02]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshPhysicalMaterial color="#689F38" roughness={0.6} />
        </mesh>
      </group>

      {/* Back left leg */}
      <group position={[-0.25, 0.08, -0.2]} rotation={[0, 0.2 + legMove, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.055, 0.12, 8, 8]} />
          <meshPhysicalMaterial color="#7CB342" roughness={0.5} clearcoat={0.3} />
        </mesh>
        <mesh position={[-0.06, -0.07, -0.02]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshPhysicalMaterial color="#689F38" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

// Main Turtle component
const Turtle = ({ turtleData }) => {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = turtleData.x
      groupRef.current.position.z = turtleData.z
      groupRef.current.rotation.y = turtleData.rotationY
    }
  })

  return (
    <group ref={groupRef} position={[turtleData.x, 0, turtleData.z]}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1, 0.875, 1]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      <TurtleGeometry headOut={turtleData.headOut} legPhase={turtleData.legPhase} />
    </group>
  )
}

export default Turtle
