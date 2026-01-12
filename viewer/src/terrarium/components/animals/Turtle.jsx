import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import SpriteBillboard from './SpriteBillboard'

const turtleSprite = {
  url: '/sprites/turtle.png',
  baseHeight: 0.85,
  groundOffset: 0.02,
  shadowScale: [0.95, 0.65],
  shadowOpacity: 0.4,
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

  const walkBob = Math.sin(turtleData.legPhase) * 0.015
  const walkFactor = 1 - Math.abs(walkBob) * 6
  const shadowScale = Array.isArray(turtleSprite.shadowScale)
    ? turtleSprite.shadowScale.map(scale => scale * walkFactor)
    : turtleSprite.shadowScale * walkFactor

  return (
    <group ref={groupRef} position={[turtleData.x, 0, turtleData.z]}>
      <SpriteBillboard
        textureUrl={turtleSprite.url}
        position={[0, 0, 0]}
        baseHeight={turtleSprite.baseHeight}
        scale={0.95 + turtleData.headOut * 0.05}
        yOffset={turtleSprite.groundOffset + walkBob}
        shadowScale={shadowScale}
        shadowOpacity={turtleSprite.shadowOpacity * walkFactor}
        flipX={turtleData.direction < 0}
      />
    </group>
  )
}

export default Turtle
