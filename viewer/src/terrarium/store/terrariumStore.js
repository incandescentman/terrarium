import { create } from 'zustand'

export const useTerrariumStore = create((set, get) => ({
  // Frogs - converted from SVG percentage coordinates to 3D world space
  // Original: x: 0-100 (%), y: 0-100 (%) -> New: x: -5 to 5, z: -3 to 3
  frogs: [
    {
      id: 1,
      x: -2.8,
      z: 0.8,
      y: 0,
      targetX: -2.8,
      targetZ: 0.8,
      type: 'redEyed',
      eyeOpen: true,
      breathePhase: 0,
      state: 'idle'
    },
    {
      id: 2,
      x: 2.2,
      z: -0.5,
      y: 0,
      targetX: 2.2,
      targetZ: -0.5,
      type: 'poisonDart',
      eyeOpen: true,
      breathePhase: Math.PI,
      state: 'idle'
    },
    {
      id: 3,
      x: -0.2,
      z: 2.2,
      y: 0,
      targetX: -0.2,
      targetZ: 2.2,
      type: 'greenTree',
      eyeOpen: true,
      breathePhase: Math.PI * 0.6,
      state: 'idle'
    },
  ],

  turtles: [
    {
      id: 1,
      x: -3.2,
      z: 1.5,
      targetX: -3.2,
      direction: 1,
      headOut: 1,
      legPhase: 0,
      rotationY: 0
    },
    {
      id: 2,
      x: 2.8,
      z: 2,
      targetX: 2.8,
      direction: -1,
      headOut: 1,
      legPhase: Math.PI,
      rotationY: Math.PI
    },
  ],

  fireflies: Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: -4 + Math.random() * 8,
    y: 0.5 + Math.random() * 2.5,
    z: -2 + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.5,
  })),

  waterDrops: [],
  ripples: [],

  // Actions
  updateFrog: (id, updates) => set(state => ({
    frogs: state.frogs.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  updateTurtle: (id, updates) => set(state => ({
    turtles: state.turtles.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  updateFirefly: (id, updates) => set(state => ({
    fireflies: state.fireflies.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  addRipple: (ripple) => set(state => ({
    ripples: [...state.ripples, ripple]
  })),

  updateRipples: (updater) => set(state => ({
    ripples: updater(state.ripples)
  })),

  addWaterDrop: (drop) => set(state => ({
    waterDrops: [...state.waterDrops, drop]
  })),

  updateWaterDrops: (updater) => set(state => ({
    waterDrops: updater(state.waterDrops)
  })),

  // Behavior triggers
  triggerBlink: (frogId) => {
    const { updateFrog } = get()
    updateFrog(frogId, { eyeOpen: false })
    setTimeout(() => updateFrog(frogId, { eyeOpen: true }), 150)
  },

  triggerJump: (frogId, targetX, targetZ) => {
    const { updateFrog } = get()
    updateFrog(frogId, { targetX, targetZ, state: 'jumping' })
  },

  triggerTurtleHeadToggle: (turtleId) => {
    const { turtles, updateTurtle } = get()
    const turtle = turtles.find(t => t.id === turtleId)
    if (turtle) {
      updateTurtle(turtleId, { headOut: turtle.headOut > 0.5 ? 0 : 1 })
    }
  },
}))
