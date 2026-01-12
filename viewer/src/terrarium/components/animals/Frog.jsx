import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import SpriteBillboard from './SpriteBillboard'

const frogSprites = {
  redEyed: {
    url: '/sprites/frog-red-eyed.png',
    baseHeight: 0.62,
    groundOffset: 0.01,
    shadowScale: [0.6, 0.42],
    shadowOpacity: 0.38,
  },
  poisonDart: {
    url: '/sprites/frog-poison-dart.png',
    baseHeight: 0.5,
    groundOffset: 0.01,
    shadowScale: [0.5, 0.34],
    shadowOpacity: 0.34,
  },
  greenTree: {
    url: '/sprites/frog-green-tree.png',
    baseHeight: 0.6,
    groundOffset: 0.01,
    shadowScale: [0.65, 0.44],
    shadowOpacity: 0.36,
  },
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
  const spriteConfig = frogSprites[frogData.type] || frogSprites.greenTree
  const jumpFactor = Math.max(0.4, 1 - frogData.y * 6)
  const shadowScale = Array.isArray(spriteConfig.shadowScale)
    ? spriteConfig.shadowScale.map(scale => scale * jumpFactor)
    : spriteConfig.shadowScale * jumpFactor

  return (
    <group ref={groupRef}>
      <SpriteBillboard
        textureUrl={spriteConfig.url}
        position={[0, 0, 0]}
        baseHeight={spriteConfig.baseHeight}
        scale={breatheScale}
        yOffset={spriteConfig.groundOffset + frogData.y}
        shadowScale={shadowScale}
        shadowOpacity={spriteConfig.shadowOpacity * jumpFactor}
        flipX={frogData.direction < 0}
      />
    </group>
  )
}

export default Frog
