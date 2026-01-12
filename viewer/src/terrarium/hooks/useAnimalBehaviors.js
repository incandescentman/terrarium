import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTerrariumStore } from '../store/terrariumStore'

// Main hook that runs all animal behavior updates
export const useAnimalBehaviors = () => {
  const {
    frogs,
    turtles,
    fireflies,
    updateFrog,
    updateTurtle,
    updateFirefly,
    triggerBlink,
    triggerJump,
    triggerTurtleHeadToggle,
    addRipple,
    updateRipples,
  } = useTerrariumStore()

  // Track time for random events
  const lastBlinkCheck = useRef(0)
  const lastMoveCheck = useRef(0)
  const lastTurtleCheck = useRef(0)
  const lastRippleCheck = useRef(0)

  // Continuous animation updates at 60fps
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Update frog states
    frogs.forEach(frog => {
      // Breathing animation (continuous sine wave)
      const newBreathePhase = (frog.breathePhase + delta * 2) % (Math.PI * 2)

      // Smooth movement interpolation toward target
      const dx = frog.targetX - frog.x
      const dz = frog.targetZ - frog.z
      const distance = Math.sqrt(dx * dx + dz * dz)

      let newX = frog.x
      let newZ = frog.z
      let newY = frog.y
      let newState = frog.state
      let newDirection = frog.direction

      if (distance > 0.08) {
        // Move toward target
        newX = frog.x + dx * delta * 1.5
        newZ = frog.z + dz * delta * 1.5
        // Subtle hop - single arc based on distance traveled, not time
        const progress = 1 - (distance / 2) // 0 at start, 1 at end
        newY = Math.sin(progress * Math.PI) * 0.08
        newState = 'jumping'
        if (Math.abs(dx) > 0.02) {
          newDirection = dx > 0 ? 1 : -1
        }
      } else {
        // Arrived - settle down smoothly
        newY = frog.y * 0.85
        newState = 'idle'
      }

      updateFrog(frog.id, {
        breathePhase: newBreathePhase,
        x: newX,
        z: newZ,
        y: newY,
        state: newState,
        direction: newDirection,
      })
    })

    // Update turtle states
    turtles.forEach(turtle => {
      // Leg walking animation
      const newLegPhase = turtle.legPhase + delta * 3

      // Smooth head extension/retraction
      const targetHeadOut = turtle.headOut

      // Smooth movement toward target
      const dx = turtle.targetX - turtle.x
      let newX = turtle.x

      if (Math.abs(dx) > 0.02 && turtle.headOut > 0.5) {
        newX = turtle.x + dx * delta * 0.5
      }

      updateTurtle(turtle.id, {
        legPhase: newLegPhase,
        x: newX,
      })
    })

    // Update fireflies - gentle drifting motion
    fireflies.forEach(firefly => {
      // Slow, gentle floating
      const newX = firefly.x + Math.sin(time * firefly.speed * 0.3 + firefly.id) * delta * 0.15
      const newY = firefly.y + Math.sin(time * firefly.speed * 0.4 + firefly.id * 2) * delta * 0.1
      const newZ = firefly.z + Math.cos(time * firefly.speed * 0.25 + firefly.id * 3) * delta * 0.12

      // Keep within bounds
      const clampedX = Math.max(-4.5, Math.min(4.5, newX))
      const clampedY = Math.max(0.5, Math.min(2.5, newY))
      const clampedZ = Math.max(-2, Math.min(2.5, newZ))

      updateFirefly(firefly.id, {
        x: clampedX,
        y: clampedY,
        z: clampedZ,
      })
    })

    // Update ripples
    updateRipples(ripples =>
      ripples
        .map(r => ({
          ...r,
          size: r.size + delta * 0.8,
          opacity: r.opacity - delta * 0.3,
        }))
        .filter(r => r.opacity > 0)
    )
  })

  // Random behavior triggers (interval-based like original)
  useEffect(() => {
    // Blink check every 500ms
    const blinkInterval = setInterval(() => {
      frogs.forEach(frog => {
        if (Math.random() < 0.08) {
          triggerBlink(frog.id)
        }
      })
    }, 500)

    // Movement check - less frequent, smaller hops
    const moveInterval = setInterval(() => {
      frogs.forEach(frog => {
        if (Math.random() < 0.04) {
          // Occasional small hop within bounds
          const newTargetX = Math.max(-4, Math.min(4, frog.x + (Math.random() - 0.5) * 1.2))
          const newTargetZ = Math.max(-2, Math.min(2.5, frog.z + (Math.random() - 0.5) * 1))
          triggerJump(frog.id, newTargetX, newTargetZ)
        }
      })
    }, 1000)

    // Turtle behavior every 200ms
    const turtleInterval = setInterval(() => {
      turtles.forEach(turtle => {
        // Random head toggle
        if (Math.random() < 0.05) {
          triggerTurtleHeadToggle(turtle.id)
        }

        // Random movement when head is out
        if (Math.random() < 0.2 && turtle.headOut > 0.5) {
          const newDir = Math.random() < 0.1 ? -turtle.direction : turtle.direction
          const newTargetX = Math.max(-4.5, Math.min(4.5, turtle.x + newDir * 0.3))
          updateTurtle(turtle.id, {
            targetX: newTargetX,
            direction: newDir,
            rotationY: newDir > 0 ? 0 : Math.PI,
          })
        }
      })
    }, 200)

    // Ripple generation every 1200ms
    const rippleInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        addRipple({
          id: Date.now(),
          x: -2.8 + Math.random() * 1.5, // Water pool area
          z: 1.2 + Math.random() * 0.8,
          size: 0,
          opacity: 0.6,
        })
      }
    }, 1200)

    return () => {
      clearInterval(blinkInterval)
      clearInterval(moveInterval)
      clearInterval(turtleInterval)
      clearInterval(rippleInterval)
    }
  }, []) // Empty deps - we access latest state via store
}

// Hook for firefly glow calculation
export const useFireflyGlow = (firefly, time) => {
  return 0.3 + 0.7 * Math.abs(Math.sin(firefly.phase + time * 0.05 * firefly.speed))
}
