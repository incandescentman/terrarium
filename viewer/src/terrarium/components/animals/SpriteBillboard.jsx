import { useEffect, useMemo } from 'react'
import { Billboard, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const shadowDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='black' stop-opacity='0.4'/%3E%3Cstop offset='60%25' stop-color='black' stop-opacity='0.2'/%3E%3Cstop offset='100%25' stop-color='black' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='128' height='128' fill='url(%23g)'/%3E%3C/svg%3E"
const emissiveColor = new THREE.Color('#ffffff')

const SpriteBillboard = ({
  textureUrl,
  position,
  baseHeight = 0.6,
  scale = 1,
  flipX = false,
  opacity = 1,
  yOffset = 0,
  anchorY = 0,
  shadowScale = 0.75,
  shadowOpacity = 0.35,
  shadowYOffset = 0.01,
}) => {
  const { gl } = useThree()
  const texture = useTexture(textureUrl)
  const shadowTexture = useTexture(shadowDataUrl)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    texture.premultiplyAlpha = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
    texture.needsUpdate = true
  }, [gl, texture])

  useEffect(() => {
    shadowTexture.colorSpace = THREE.SRGBColorSpace
    shadowTexture.anisotropy = 1
    shadowTexture.minFilter = THREE.LinearFilter
    shadowTexture.magFilter = THREE.LinearFilter
    shadowTexture.generateMipmaps = false
    shadowTexture.needsUpdate = true
  }, [shadowTexture])

  const planeSize = useMemo(() => {
    const image = texture.image
    if (!image?.width || !image?.height) {
      return [baseHeight, baseHeight]
    }
    const aspect = image.width / image.height
    return [baseHeight * aspect, baseHeight]
  }, [texture.image, baseHeight])

  const shadowSize = useMemo(() => {
    if (Array.isArray(shadowScale)) {
      return shadowScale
    }
    return [shadowScale, shadowScale]
  }, [shadowScale])

  const anchorOffset = useMemo(() => {
    return planeSize[1] * (0.5 - anchorY)
  }, [planeSize, anchorY])

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, shadowYOffset, 0]}>
        <planeGeometry args={shadowSize} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent
          opacity={shadowOpacity}
          depthWrite={false}
        />
      </mesh>

      <Billboard position={[0, yOffset, 0]} lockX lockZ follow>
        <group
          scale={[flipX ? -scale : scale, scale, 1]}
          position={[0, anchorOffset, 0]}
        >
          <mesh>
            <planeGeometry args={planeSize} />
            <meshStandardMaterial
              map={texture}
              alphaMap={texture}
              transparent
              alphaTest={0.3}
              roughness={1}
              metalness={0}
              emissive={emissiveColor}
              emissiveIntensity={0.15}
              side={THREE.DoubleSide}
              opacity={opacity}
              depthWrite
            />
          </mesh>
        </group>
      </Billboard>
    </group>
  )
}

export default SpriteBillboard
