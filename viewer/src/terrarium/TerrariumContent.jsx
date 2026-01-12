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

// Background foliage (blurred depth)
const BackgroundFoliage = () => {
  const foliageElements = []

  // Distant blurry foliage shapes
  for (let i = 0; i < 20; i++) {
    const x = -6 + Math.random() * 12
    const y = 1 + Math.random() * 3
    const z = -4 - Math.random() * 3
    const scale = 0.5 + Math.random() * 1

    foliageElements.push(
      <mesh key={i} position={[x, y, z]} scale={scale}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color={`hsl(${120 + Math.random() * 30}, ${40 + Math.random() * 20}%, ${20 + Math.random() * 15}%)`}
          roughness={1}
        />
      </mesh>
    )
  }

  return <group>{foliageElements}</group>
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
