import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { frogMaterials } from '../../materials/FrogSkinMaterial'

// Procedural stylized frog geometry since we don't have GLTF models yet
// This creates a cute Pixar-style frog using basic shapes

const FrogGeometry = ({ type, eyeOpen, breatheScale }) => {
  const materials = useMemo(() => frogMaterials[type], [type])
  const skinMat = useMemo(() => materials.skin(), [materials])
  const eyeMat = useMemo(() => materials.eye(), [materials])
  const bellyMat = useMemo(() => materials.belly?.() || skinMat, [materials, skinMat])
  const toeMat = useMemo(() => materials.toe?.() || skinMat, [materials, skinMat])

  // Type-specific colors for variety
  const typeColors = {
    redEyed: { body: '#43A047', belly: '#E8F5E9', eye: '#D50000', toe: '#FF9800' },
    poisonDart: { body: '#01579B', belly: '#01579B', eye: '#FFD700', toe: '#01579B' },
    greenTree: { body: '#689F38', belly: '#F1F8E9', eye: '#FFD54F', toe: '#689F38' },
  }
  const colors = typeColors[type]

  return (
    <group scale={[breatheScale, breatheScale, breatheScale]}>
      {/* Body */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial
          color={colors.body}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.15}
          thickness={0.5}
        />
      </mesh>

      {/* Belly (lighter underside) */}
      <mesh position={[0, 0.08, 0.05]} scale={[0.9, 0.6, 0.8]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial
          color={colors.belly}
          roughness={0.4}
          clearcoat={0.5}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 0.22, 0.18]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshPhysicalMaterial
          color={colors.body}
          roughness={0.3}
          clearcoat={0.8}
          transmission={0.1}
        />
      </mesh>

      {/* Eye bulges */}
      <mesh position={[-0.1, 0.32, 0.22]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.35} clearcoat={0.7} />
      </mesh>
      <mesh position={[0.1, 0.32, 0.22]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.35} clearcoat={0.7} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 0.34, 0.26]} scale={[1, eyeOpen ? 1 : 0.2, 1]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshPhysicalMaterial
          color={colors.eye}
          roughness={0.05}
          clearcoat={1}
          emissive={colors.eye}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0.1, 0.34, 0.26]} scale={[1, eyeOpen ? 1 : 0.2, 1]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshPhysicalMaterial
          color={colors.eye}
          roughness={0.05}
          clearcoat={1}
          emissive={colors.eye}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Pupils */}
      {eyeOpen && (
        <>
          <mesh position={[-0.1, 0.34, 0.31]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.1, 0.34, 0.31]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Eye highlights */}
          <mesh position={[-0.12, 0.36, 0.32]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.08, 0.36, 0.32]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Front legs */}
      <mesh castShadow position={[-0.18, 0.05, 0.1]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.04, 0.15, 8, 8]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.4} clearcoat={0.6} />
      </mesh>
      <mesh castShadow position={[0.18, 0.05, 0.1]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.04, 0.15, 8, 8]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.4} clearcoat={0.6} />
      </mesh>

      {/* Front toes */}
      <mesh position={[-0.25, 0.02, 0.12]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={colors.toe} roughness={0.6} />
      </mesh>
      <mesh position={[0.25, 0.02, 0.12]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={colors.toe} roughness={0.6} />
      </mesh>

      {/* Back legs */}
      <mesh castShadow position={[-0.15, 0.08, -0.15]} rotation={[0.3, 0, -0.8]}>
        <capsuleGeometry args={[0.05, 0.2, 8, 8]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.4} clearcoat={0.6} />
      </mesh>
      <mesh castShadow position={[0.15, 0.08, -0.15]} rotation={[0.3, 0, 0.8]}>
        <capsuleGeometry args={[0.05, 0.2, 8, 8]} />
        <meshPhysicalMaterial color={colors.body} roughness={0.4} clearcoat={0.6} />
      </mesh>

      {/* Back toes */}
      <mesh position={[-0.28, 0.02, -0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={colors.toe} roughness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.02, -0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={colors.toe} roughness={0.6} />
      </mesh>

      {/* Poison dart frog spots */}
      {type === 'poisonDart' && (
        <>
          <mesh position={[-0.08, 0.2, 0.05]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#000000" roughness={0.4} />
          </mesh>
          <mesh position={[0.1, 0.18, -0.02]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#000000" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0.1]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#000000" roughness={0.4} />
          </mesh>
        </>
      )}

      {/* Red-eyed frog blue stripes */}
      {type === 'redEyed' && (
        <>
          <mesh position={[-0.22, 0.15, 0]} rotation={[0, 0, 0.2]}>
            <capsuleGeometry args={[0.015, 0.1, 4, 4]} />
            <meshStandardMaterial color="#2196F3" roughness={0.3} />
          </mesh>
          <mesh position={[0.22, 0.15, 0]} rotation={[0, 0, -0.2]}>
            <capsuleGeometry args={[0.015, 0.1, 4, 4]} />
            <meshStandardMaterial color="#2196F3" roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  )
}

// Main Frog component that handles positioning and animation
const Frog = ({ frogData }) => {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = frogData.x
      groupRef.current.position.y = frogData.y
      groupRef.current.position.z = frogData.z
    }
  })

  const breatheScale = 1 + Math.sin(frogData.breathePhase) * 0.03

  return (
    <group ref={groupRef}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      <FrogGeometry
        type={frogData.type}
        eyeOpen={frogData.eyeOpen}
        breatheScale={breatheScale}
      />
    </group>
  )
}

export default Frog
