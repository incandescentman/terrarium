import * as THREE from 'three'

// Creates a realistic wet amphibian skin material using MeshPhysicalMaterial
// with subsurface scattering approximation via transmission
export const createFrogSkinMaterial = (baseColor, sssColor, options = {}) => {
  return new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: 0,
    roughness: options.roughness ?? 0.3,
    clearcoat: options.clearcoat ?? 0.8,
    clearcoatRoughness: 0.1,
    transmission: 0.15,
    thickness: 0.5,
    attenuationColor: new THREE.Color(sssColor),
    attenuationDistance: 0.3,
    ior: 1.4,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
  })
}

// Eye material with high reflectivity and slight glow
export const createEyeMaterial = (irisColor, options = {}) => {
  return new THREE.MeshPhysicalMaterial({
    color: irisColor,
    metalness: 0,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0,
    envMapIntensity: 2.5,
    emissive: new THREE.Color(irisColor),
    emissiveIntensity: options.emissiveIntensity ?? 0.15,
  })
}

// Presets for each frog type
export const frogMaterials = {
  redEyed: {
    skin: () => createFrogSkinMaterial('#43A047', '#8BC34A'),
    eye: () => createEyeMaterial('#D50000', { emissiveIntensity: 0.2 }),
    belly: () => createFrogSkinMaterial('#E8F5E9', '#FFFFFF', { clearcoat: 0.5 }),
    toe: () => new THREE.MeshStandardMaterial({ color: '#FF9800', roughness: 0.6 }),
  },
  poisonDart: {
    skin: () => createFrogSkinMaterial('#01579B', '#00E5FF'),
    eye: () => createEyeMaterial('#FFD700'),
    spots: () => new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.4 }),
  },
  greenTree: {
    skin: () => createFrogSkinMaterial('#689F38', '#AED581'),
    eye: () => createEyeMaterial('#FFD54F'),
    belly: () => createFrogSkinMaterial('#F1F8E9', '#FFFFFF', { clearcoat: 0.4 }),
  },
}

// Turtle materials
export const turtleMaterials = {
  shell: () => new THREE.MeshStandardMaterial({
    color: '#5D4037',
    roughness: 0.7,
    metalness: 0.1,
  }),
  shellPattern: () => new THREE.MeshStandardMaterial({
    color: '#3E2723',
    roughness: 0.8,
  }),
  skin: () => createFrogSkinMaterial('#7CB342', '#9CCC65', { clearcoat: 0.4, roughness: 0.5 }),
  eye: () => createEyeMaterial('#1A1A1A'),
}

// Water material
export const createWaterMaterial = () => {
  return new THREE.MeshPhysicalMaterial({
    color: '#1976D2',
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 1,
    ior: 1.33,
    transparent: true,
    opacity: 0.8,
  })
}

// Ground/substrate material
export const createSubstrateMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: '#3E2723',
    roughness: 0.95,
    metalness: 0,
  })
}

// Moss material
export const createMossMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: '#4CAF50',
    roughness: 0.9,
    metalness: 0,
  })
}

// Rock material
export const createRockMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: '#5D4037',
    roughness: 0.85,
    metalness: 0.05,
  })
}

// Plant/leaf material
export const createLeafMaterial = (baseColor = '#388E3C') => {
  return new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: 0,
    roughness: 0.4,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    transmission: 0.1,
    thickness: 0.2,
    side: THREE.DoubleSide,
  })
}

// Glass tank material
export const createGlassMaterial = () => {
  return new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0,
    roughness: 0,
    transmission: 0.98,
    thickness: 0.1,
    ior: 1.5,
    transparent: true,
  })
}
