import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { useTerrariumStore } from './store/terrariumStore'
import { useAnimalBehaviors } from './hooks/useAnimalBehaviors'

// Animals
import Frog from './components/animals/Frog'
import Turtle from './components/animals/Turtle'

// Environment
import Substrate from './components/environment/Substrate'
import WaterPool from './components/environment/WaterPool'
import Rocks from './components/environment/Rocks'
import MossPatches from './components/environment/MossPatch'
import Branch from './components/environment/Branch'
import GlassTank from './components/environment/GlassTank'

// Plants
import { MonsteraLeaf } from './components/plants/MonsteraLeaf'
import Fern from './components/plants/Fern'
import Bromeliad from './components/plants/Bromeliad'

// Effects
import Fireflies from './components/effects/Fireflies'

// Lighting setup
const TerrariumLighting = () => (
  <>
    {/* Main key light - terrarium lamp simulation */}
    <directionalLight
      position={[3, 8, 2]}
      intensity={2}
      color="#fff5e6"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-far={20}
      shadow-camera-near={1}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
      shadow-bias={-0.0001}
    />

    {/* Fill light from opposite side */}
    <directionalLight
      position={[-3, 4, -2]}
      intensity={0.6}
      color="#e6fff2"
    />

    {/* Ambient for shadow fill - forest green tint */}
    <ambientLight intensity={0.2} color="#2d5a3f" />

    {/* Rim light for depth separation */}
    <spotLight
      position={[0, -1, 5]}
      intensity={0.4}
      angle={0.8}
      penumbra={1}
      color="#87CEEB"
    />

    {/* Top warm light */}
    <pointLight
      position={[0, 5, 0]}
      intensity={0.5}
      color="#fff8e1"
      distance={12}
      decay={2}
    />
  </>
)

// Simple tree component for background
const BackgroundTree = ({ position, trunkHeight = 2, canopySize = 1.5, canopyHue = 125 }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, trunkHeight, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>
      {/* Main canopy */}
      <mesh position={[0, trunkHeight + canopySize * 0.4, 0]}>
        <sphereGeometry args={[canopySize, 8, 6]} />
        <meshStandardMaterial
          color={`hsl(${canopyHue}, 45%, 16%)`}
          roughness={0.95}
        />
      </mesh>
      {/* Secondary canopy cluster */}
      <mesh position={[canopySize * 0.4, trunkHeight + canopySize * 0.1, canopySize * 0.3]}>
        <sphereGeometry args={[canopySize * 0.6, 6, 5]} />
        <meshStandardMaterial
          color={`hsl(${canopyHue + 8}, 42%, 14%)`}
          roughness={0.95}
        />
      </mesh>
      <mesh position={[-canopySize * 0.35, trunkHeight + canopySize * 0.2, -canopySize * 0.25]}>
        <sphereGeometry args={[canopySize * 0.5, 6, 5]} />
        <meshStandardMaterial
          color={`hsl(${canopyHue - 5}, 48%, 18%)`}
          roughness={0.95}
        />
      </mesh>
    </group>
  )
}

// Background foliage (static jungle leaves and trees)
const BackgroundFoliage = () => {
  // Pre-generated static leaf positions for consistent rendering
  const leaves = [
    // Left side foliage
    { pos: [-5, 2.5, -4], rot: [0.2, 0.3, -0.4], scale: 1.2, hue: 125 },
    { pos: [-4.5, 1.8, -4.5], rot: [-0.1, 0.5, 0.2], scale: 0.9, hue: 135 },
    { pos: [-5.5, 3.2, -5], rot: [0.3, -0.2, -0.3], scale: 1.4, hue: 118 },
    { pos: [-4, 2.2, -3.8], rot: [0.1, 0.4, 0.1], scale: 0.8, hue: 130 },
    { pos: [-5.2, 1.5, -4.2], rot: [-0.2, 0.1, 0.3], scale: 1.1, hue: 140 },
    // Right side foliage
    { pos: [5, 2.8, -4], rot: [0.2, -0.4, 0.3], scale: 1.3, hue: 128 },
    { pos: [4.5, 1.6, -4.5], rot: [-0.1, -0.3, -0.2], scale: 1.0, hue: 122 },
    { pos: [5.5, 3.5, -5], rot: [0.4, 0.2, 0.2], scale: 1.5, hue: 132 },
    { pos: [4.2, 2.4, -3.8], rot: [0.0, -0.5, 0.1], scale: 0.85, hue: 138 },
    { pos: [5.3, 1.9, -4.3], rot: [-0.3, -0.1, -0.3], scale: 1.05, hue: 126 },
    // Top/center background
    { pos: [0, 3.5, -5.5], rot: [0.5, 0, 0], scale: 1.2, hue: 130 },
    { pos: [-1.5, 3.8, -5], rot: [0.4, 0.2, -0.1], scale: 1.0, hue: 120 },
    { pos: [1.5, 3.6, -5.2], rot: [0.3, -0.2, 0.1], scale: 1.1, hue: 136 },
    { pos: [-2.5, 3.2, -4.8], rot: [0.2, 0.3, -0.2], scale: 0.9, hue: 142 },
    { pos: [2.5, 3.4, -4.6], rot: [0.25, -0.35, 0.15], scale: 0.95, hue: 124 },
  ]

  // Background trees
  const trees = [
    // Far back trees
    { pos: [-7, 0, -8], trunkHeight: 3.5, canopySize: 2.2, canopyHue: 120 },
    { pos: [-3, 0, -9], trunkHeight: 4, canopySize: 2.5, canopyHue: 128 },
    { pos: [2, 0, -10], trunkHeight: 4.5, canopySize: 2.8, canopyHue: 118 },
    { pos: [7, 0, -8], trunkHeight: 3.2, canopySize: 2, canopyHue: 132 },
    // Mid-distance trees
    { pos: [-8, 0, -6], trunkHeight: 2.8, canopySize: 1.8, canopyHue: 125 },
    { pos: [8, 0, -6], trunkHeight: 3, canopySize: 1.9, canopyHue: 122 },
    { pos: [0, 0, -7], trunkHeight: 3.8, canopySize: 2.3, canopyHue: 130 },
    // Smaller accent trees
    { pos: [-5.5, 0, -5.5], trunkHeight: 2, canopySize: 1.3, canopyHue: 138 },
    { pos: [5.5, 0, -5.5], trunkHeight: 2.2, canopySize: 1.4, canopyHue: 135 },
  ]

  return (
    <group>
      {/* Background trees */}
      {trees.map((tree, i) => (
        <BackgroundTree
          key={`tree-${i}`}
          position={tree.pos}
          trunkHeight={tree.trunkHeight}
          canopySize={tree.canopySize}
          canopyHue={tree.canopyHue}
        />
      ))}

      {/* Leaf shapes */}
      {leaves.map((leaf, i) => (
        <mesh
          key={`leaf-${i}`}
          position={leaf.pos}
          rotation={leaf.rot}
          scale={leaf.scale}
        >
          <sphereGeometry args={[0.4, 6, 4]} />
          <meshStandardMaterial
            color={`hsl(${leaf.hue}, 50%, 18%)`}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Large background foliage masses */}
      <mesh position={[-6, 2, -6]} scale={[2, 3, 0.5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1a3d25" roughness={1} />
      </mesh>
      <mesh position={[6, 2.5, -6]} scale={[2.5, 3.5, 0.5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#1f4a2c" roughness={1} />
      </mesh>
      <mesh position={[0, 3, -7]} scale={[4, 2, 0.5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#163820" roughness={1} />
      </mesh>
    </group>
  )
}

// Main content orchestrator
const TerrariumContent = () => {
  const frogs = useTerrariumStore(state => state.frogs)
  const turtles = useTerrariumStore(state => state.turtles)

  // Run behavior animations
  useAnimalBehaviors()

  return (
    <>
      <TerrariumLighting />

      {/* Environment map for reflections */}
      <Environment preset="forest" background={false} />

      {/* Background atmosphere */}
      <color attach="background" args={['#0d2818']} />
      <fog attach="fog" args={['#1a4a2e', 8, 20]} />

      <Suspense fallback={null}>
        {/* Background foliage layers */}
        <BackgroundFoliage />

        {/* Ground and base environment */}
        <Substrate />
        <WaterPool position={[-2.5, 0.02, 1.2]} size={[2, 1.4]} />
        <Rocks />
        <MossPatches />
        <Branch />

        {/* Plants */}
        <Fern position={[-4, 0, -1]} scale={1.2} />
        <Fern position={[4.2, 0, -0.5]} scale={1} />
        <Bromeliad position={[-2, 0, -1.5]} scale={1.1} />
        <Bromeliad position={[2.5, 0, -1.8]} scale={0.9} />

        {/* Monstera leaves around the edges */}
        <MonsteraLeaf position={[-4.5, 0, 1]} rotation={[-0.5, 0.5, -0.2]} scale={1.2} />
        <MonsteraLeaf position={[4.5, 0, 0.5]} rotation={[-0.5, -0.5, 0.2]} scale={1.1} />
        <MonsteraLeaf position={[0, 0, -2.5]} rotation={[-0.3, 0, 0]} scale={1} />
        <MonsteraLeaf position={[-2, 0, 2.5]} rotation={[-0.6, 0.3, -0.1]} scale={0.9} />
        <MonsteraLeaf position={[2, 0, 2.5]} rotation={[-0.6, -0.3, 0.1]} scale={0.85} />

        {/* Turtles */}
        {turtles.map(turtle => (
          <Turtle key={turtle.id} turtleData={turtle} />
        ))}

        {/* Frogs */}
        {frogs.map(frog => (
          <Frog key={frog.id} frogData={frog} />
        ))}

        {/* Fireflies disabled for now */}
        {/* <Fireflies /> */}

        {/* Glass enclosure (very subtle) */}
        <GlassTank size={[10, 4, 6]} />
      </Suspense>
    </>
  )
}

export default TerrariumContent
