import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
  ToneMapping,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import TerrariumContent from './TerrariumContent'

// Post-processing effects for cinematic look
const PostProcessing = () => (
  <EffectComposer>
    {/* Depth of Field - subtle cinematic focus */}
    <DepthOfField
      focusDistance={0.02}
      focalLength={0.08}
      bokehScale={3}
      height={480}
    />

    {/* Bloom for firefly glow and wet surface highlights */}
    <Bloom
      intensity={0.4}
      luminanceThreshold={0.8}
      luminanceSmoothing={0.9}
      mipmapBlur
    />

    {/* Vignette for cinematic framing */}
    <Vignette
      offset={0.35}
      darkness={0.5}
      blendFunction={BlendFunction.NORMAL}
    />

    {/* Subtle chromatic aberration on edges */}
    <ChromaticAberration
      offset={[0.0008, 0.0008]}
      blendFunction={BlendFunction.NORMAL}
    />

    {/* Tone mapping for color grading */}
    <ToneMapping
      blendFunction={BlendFunction.NORMAL}
      adaptive={true}
      resolution={256}
      middleGrey={0.5}
      maxLuminance={16.0}
      averageLuminance={1.0}
      adaptationRate={1.0}
    />
  </EffectComposer>
)

// Main scene component
const TerrariumScene = () => {
  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: '#0d2818' }}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 2.5, 7]}
          fov={42}
          near={0.1}
          far={50}
        />

        {/* Orbit controls for interaction */}
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          maxAzimuthAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 3}
          enableDamping
          dampingFactor={0.05}
          target={[0, 0.5, 0]}
        />

        {/* Scene content */}
        <TerrariumContent />

        {/* Post-processing */}
        <PostProcessing />
      </Canvas>

      {/* Glass frame overlay (HTML layer) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '12px solid transparent',
          borderImage: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%) 1',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
        }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(10, 20, 10, 0.4) 100%)',
        }}
      />
    </div>
  )
}

export default TerrariumScene
