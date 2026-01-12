import React, { useState, useEffect } from 'react';

const RealisticTerrarium = () => {
  const [time, setTime] = useState(0);
  
  const [frogs, setFrogs] = useState([
    { id: 1, x: 22, y: 58, targetX: 22, targetY: 58, type: 'redEyed', eyeOpen: true, breathe: 0 },
    { id: 2, x: 72, y: 45, targetX: 72, targetY: 45, type: 'poisonDart', eyeOpen: true, breathe: 0.5 },
    { id: 3, x: 48, y: 72, targetX: 48, targetY: 72, type: 'greenTree', eyeOpen: true, breathe: 0.3 },
  ]);

  const [turtles, setTurtles] = useState([
    { id: 1, x: 18, y: 82, targetX: 18, direction: 1, headOut: 1, legPhase: 0 },
    { id: 2, x: 78, y: 85, targetX: 78, direction: -1, headOut: 1, legPhase: 0.5 },
  ]);

  const [fireflies, setFireflies] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }))
  );

  const [waterDrops, setWaterDrops] = useState([]);
  const [ripples, setRipples] = useState([]);

  // Main time loop
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  // Frog behaviors
  useEffect(() => {
    const interval = setInterval(() => {
      setFrogs(prev => prev.map(frog => {
        let updates = { breathe: (frog.breathe + 0.1) % (Math.PI * 2) };
        if (Math.random() < 0.08) updates.eyeOpen = !frog.eyeOpen;
        if (Math.random() < 0.1) {
          updates.targetX = Math.max(10, Math.min(90, frog.x + (Math.random() - 0.5) * 25));
          updates.targetY = Math.max(30, Math.min(80, frog.y + (Math.random() - 0.5) * 20));
        }
        return { ...frog, ...updates };
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Smooth frog movement
  useEffect(() => {
    const interval = setInterval(() => {
      setFrogs(prev => prev.map(frog => ({
        ...frog,
        x: frog.x + (frog.targetX - frog.x) * 0.08,
        y: frog.y + (frog.targetY - frog.y) * 0.08,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Turtle behaviors
  useEffect(() => {
    const interval = setInterval(() => {
      setTurtles(prev => prev.map(turtle => {
        let updates = { legPhase: turtle.legPhase + 0.15 };
        if (Math.random() < 0.05) updates.headOut = turtle.headOut > 0.5 ? 0 : 1;
        if (Math.random() < 0.2 && turtle.headOut > 0.5) {
          const newDir = Math.random() < 0.1 ? -turtle.direction : turtle.direction;
          let newX = turtle.x + newDir * 1.5;
          if (newX < 8 || newX > 92) newDir * -1;
          updates.targetX = Math.max(8, Math.min(92, newX));
          updates.direction = newDir;
        }
        return { ...turtle, ...updates };
      }));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Smooth turtle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTurtles(prev => prev.map(turtle => ({
        ...turtle,
        x: turtle.x + (turtle.targetX - turtle.x) * 0.05,
        headOut: turtle.headOut + (turtle.headOut > 0.5 ? 1 - turtle.headOut : -turtle.headOut) * 0.1,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Water drops on glass
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && waterDrops.length < 20) {
        setWaterDrops(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 30,
          size: 0.3 + Math.random() * 0.8,
          speed: 0.02 + Math.random() * 0.03,
        }]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [waterDrops.length]);

  // Animate water drops
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterDrops(prev => prev
        .map(d => ({ ...d, y: d.y + d.speed }))
        .filter(d => d.y < 100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Ripples
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.25) {
        setRipples(prev => [...prev, {
          id: Date.now(),
          x: 15 + Math.random() * 25,
          y: 88,
          size: 0,
          opacity: 0.6,
        }]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(prev => prev
        .map(r => ({ ...r, size: r.size + 0.3, opacity: r.opacity - 0.015 }))
        .filter(r => r.opacity > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Realistic Red-Eyed Tree Frog
  const RedEyedTreeFrog = ({ x, y, eyeOpen, breathe }) => {
    const breatheScale = 1 + Math.sin(breathe) * 0.02;
    const isJumping = Math.abs(frogs.find(f => f.type === 'redEyed')?.x - frogs.find(f => f.type === 'redEyed')?.targetX) > 2;
    const jumpY = isJumping ? Math.sin(time * 0.3) * 2 : 0;
    
    return (
      <g transform={`translate(${x}, ${y - jumpY}) scale(${breatheScale})`}>
        <defs>
          <linearGradient id="frogSkin" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#8BC34A" />
             <stop offset="100%" stopColor="#43A047" />
          </linearGradient>
          <radialGradient id="eyeSimple" cx="50%" cy="50%" r="50%">
             <stop offset="80%" stopColor="#D50000" />
             <stop offset="100%" stopColor="#8E0000" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="0" cy="4" rx="7" ry="3" fill="black" filter="url(#contactShadow)" opacity="0.6" />

        <g filter="url(#organicNoise)">
            {/* Back Leg Left */}
             <path d="M-4,0 Q-8,0 -8,4 Q-6,6 -2,3" fill="url(#frogSkin)" />
             <path d="M-8,4 L-9,6" stroke="#FF9800" strokeWidth="1" strokeLinecap="round"/>

            {/* Back Leg Right */}
             <path d="M4,0 Q8,0 8,4 Q6,6 2,3" fill="url(#frogSkin)" />
             <path d="M8,4 L9,6" stroke="#FF9800" strokeWidth="1" strokeLinecap="round"/>

            {/* Main Body */}
            <path d="M-5,2 Q0,-4 5,2 Q4,6 -2,5 Q-4,6 -5,2" fill="url(#frogSkin)" />
            
            {/* Blue Side Stripe */}
            <path d="M-3,1 Q-4,3 -2,4" stroke="#00B0FF" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M3,1 Q4,3 2,4" stroke="#00B0FF" strokeWidth="1.5" fill="none" opacity="0.8" />
            
            {/* Front Arms */}
            <path d="M-3,0 Q-6,2 -4,4" stroke="url(#frogSkin)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M3,0 Q6,2 4,4" stroke="url(#frogSkin)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Toes */}
            <circle cx="-4" cy="4" r="0.8" fill="#FF9800" />
            <circle cx="4" cy="4" r="0.8" fill="#FF9800" />
        </g>

        {/* Head */}
        <g transform="translate(0, -2)">
            <path d="M-4,0 Q0,-3 4,0 Q2,2 -2,2 Z" fill="#43A047" filter="url(#organicNoise)" />
            
            {/* Eyes */}
            <circle cx="-3" cy="-1" r="2" fill="url(#eyeSimple)" />
            <circle cx="3" cy="-1" r="2" fill="url(#eyeSimple)" />
            
            {eyeOpen && (
                <>
                <ellipse cx="-3" cy="-1" rx="0.5" ry="1.5" fill="black" transform="rotate(-15, -3, -1)" />
                <ellipse cx="3" cy="-1" rx="0.5" ry="1.5" fill="black" transform="rotate(15, 3, -1)" />
                <circle cx="-3.5" cy="-1.5" r="0.3" fill="white" opacity="0.9" />
                <circle cx="2.5" cy="-1.5" r="0.3" fill="white" opacity="0.9" />
                </>
            )}
            
            {/* Mouth */}
            <path d="M-3,1 Q0,2 3,1" stroke="#1B5E20" strokeWidth="0.5" fill="none" />
        </g>
        
        {/* Wet Speculars */}
        <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="white" opacity="0.2" filter="url(#wetHighlight)" />
      </g>
    );
  };

  // Poison Dart Frog (Blue)
  const PoisonDartFrog = ({ x, y, eyeOpen, breathe }) => {
    const breatheScale = 1 + Math.sin(breathe) * 0.015;
    
    return (
      <g transform={`translate(${x}, ${y}) scale(${breatheScale * 0.8})`}>
        <defs>
          <linearGradient id="dartBlue" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#00E5FF" />
             <stop offset="100%" stopColor="#01579B" />
          </linearGradient>
        </defs>
        
        {/* Shadow */}
        <ellipse cx="0" cy="3" rx="5" ry="2" fill="black" filter="url(#contactShadow)" opacity="0.5" />

        <g filter="url(#organicNoise)">
            {/* Rear Legs - Angular */}
            <path d="M-3,1 L-5,3 L-5,5" stroke="url(#dartBlue)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M3,1 L5,3 L5,5" stroke="url(#dartBlue)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Body Block */}
            <path d="M-3,0 Q0,-3 3,0 Q2,4 -2,4 Z" fill="url(#dartBlue)" />
            
            {/* Head - more triangular */}
            <path d="M-3,0 L0,-3 L3,0 Z" fill="url(#dartBlue)" transform="translate(0, -0.5)" />
            
            {/* Organic Spots (Paths not circles) */}
            <path d="M-1,-0.5 Q-1.5,0 -1,0.5 Q-0.5,0 -1,-0.5" fill="black" opacity="0.8" />
            <path d="M1.5,1 Q1,1.5 1.5,2 Q2,1.5 1.5,1" fill="black" opacity="0.8" />
            <path d="M0,2 Q-0.5,2.5 0,3 Q0.5,2.5 0,2" fill="black" opacity="0.8" />
            
            {/* Front Legs */}
            <path d="M-2,2 L-3,5" stroke="url(#dartBlue)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M2,2 L3,5" stroke="url(#dartBlue)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        
        {/* Eyes */}
        <circle cx="-1.5" cy="-1.5" r="0.6" fill="black" />
        <circle cx="1.5" cy="-1.5" r="0.6" fill="black" />
        
        {/* Wet Highlight */}
        <path d="M-1,-1 Q0,-2 1,-1" stroke="white" strokeWidth="0.5" opacity="0.6" fill="none" filter="url(#wetHighlight)" />
      </g>
    );
  };

  // Green Tree Frog
  const GreenTreeFrog = ({ x, y, eyeOpen, breathe }) => {
    const breatheScale = 1 + Math.sin(breathe) * 0.02;
    
    return (
      <g transform={`translate(${x}, ${y}) scale(${breatheScale * 0.9})`}>
        <defs>
          <linearGradient id="treeGreen" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#AED581" />
             <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>
        </defs>
        
        {/* Shadow */}
        <ellipse cx="0" cy="3" rx="5" ry="2" fill="black" filter="url(#contactShadow)" opacity="0.4" />

        <g filter="url(#organicNoise)">
            {/* Legs - Folded */}
            <path d="M-4,1 Q-6,1 -6,3 Q-5,5 -3,4" fill="url(#treeGreen)" />
            <path d="M4,1 Q6,1 6,3 Q5,5 3,4" fill="url(#treeGreen)" />
            
            {/* Body - Plump */}
            <path d="M-4,0 Q0,-4 4,0 Q3,4 -3,4 Z" fill="url(#treeGreen)" />
            
            {/* Head - Integration */}
            <circle cx="0" cy="-2" r="3.5" fill="url(#treeGreen)" />
            
            {/* White Lateral Stripe */}
            <path d="M-3.5,-2 Q-4,0 -3,2" stroke="#DCEDC8" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M3.5,-2 Q4,0 3,2" stroke="#DCEDC8" strokeWidth="0.8" fill="none" opacity="0.7" />
        </g>
        
        {/* Wetness */}
        <circle cx="-1.5" cy="-2.5" r="1" fill="white" opacity="0.3" filter="url(#wetHighlight)" />
        
        {/* Eyes - Gold */}
        <circle cx="-2" cy="-3.5" r="0.8" fill="#FDD835" />
        <circle cx="2" cy="-3.5" r="0.8" fill="#FDD835" />
        {eyeOpen && (
             <>
             <path d="M-2.4,-3.5 H-1.6" stroke="black" strokeWidth="0.3" />
             <path d="M1.6,-3.5 H2.4" stroke="black" strokeWidth="0.3" />
             </>
        )}
      </g>
    );
  };

  // Realistic Turtle
  const RealisticTurtle = ({ turtle }) => {
    const legMove = Math.sin(turtle.legPhase) * 8;
    const headExtend = turtle.headOut;
    
    return (
      <g transform={`translate(${turtle.x}, ${turtle.y}) scale(${turtle.direction * 0.9}, 0.9)`}>
        <defs>
            <linearGradient id="scuteGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8D6E63" />
                <stop offset="100%" stopColor="#4E342E" />
            </linearGradient>
            <radialGradient id="skinDirty" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7CB342" />
                <stop offset="100%" stopColor="#33691E" />
            </radialGradient>
        </defs>
        
        {/* Shadow */}
        <ellipse cx="0" cy="4" rx="6" ry="2" fill="black" filter="url(#contactShadow)" opacity="0.5" />

        {/* Legs - Textured */}
        <g filter="url(#organicNoise)">
            {/* Back Leg */}
            <path d={`M-2,3 Q-4,5 -5,5 L-6,6`} stroke="url(#skinDirty)" strokeWidth="3" strokeLinecap="round" transform={`rotate(${-10 + legMove})`} />
            <path d={`M2,3 Q4,5 5,5 L6,6`} stroke="url(#skinDirty)" strokeWidth="3" strokeLinecap="round" transform={`rotate(${10 - legMove})`} />
            
            {/* Front Leg */}
            <path d={`M-3,1 Q-5,3 -6,4`} stroke="url(#skinDirty)" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${-20 - legMove})`} />
            <path d={`M3,1 Q5,3 6,4`} stroke="url(#skinDirty)" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${20 + legMove})`} />
        </g>

        {/* Head */}
        <g transform={`translate(${5 + headExtend * 2}, ${-1})`} opacity={0.3 + headExtend * 0.7}>
            <path d="M0,0 Q3,-1 4,0 Q5,1 7,0.5 Q7.5,0.2 6,-0.5 Q4,-2 0,-1" fill="url(#skinDirty)" filter="url(#organicNoise)" />
            <circle cx="5" cy="-0.5" r="0.3" fill="black" />
            <path d="M6,0.5 L7,0.5" stroke="#33691E" strokeWidth="0.2" />
        </g>

        {/* Shell - Scutes not ellipses */}
        <g transform="translate(0, -2)">
             <path d="M-6,2 Q-5,-4 0,-5 Q5,-4 6,2 H-6 Z" fill="#3E2723" />
             {/* Scute Details */}
             <path d="M-4,1 Q-3,-2 -1,-3 L1,-3 Q3,-2 4,1" fill="none" stroke="#6D4C41" strokeWidth="0.5" />
             <path d="M-2,-2 L-2,1" fill="none" stroke="#6D4C41" strokeWidth="0.5" />
             <path d="M2,-2 L2,1" fill="none" stroke="#6D4C41" strokeWidth="0.5" />
             <path d="M-1,-3 L0,-4 L1,-3" fill="none" stroke="#6D4C41" strokeWidth="0.5" />
        </g>
        
      </g>
    );
  };

  // Realistic tropical leaf
  const TropicalLeaf = ({ x, y, rotation, scale = 1, type = 'monstera' }) => {
    const sway = Math.sin(time * 0.02 + x * 0.1) * 3;
    
    if (type === 'monstera') {
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotation + sway}) scale(${scale})`}>
          <defs>
            <linearGradient id={`monsteraGrad${x}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="50%" stopColor="#388E3C" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>
          <path d="M0,0 Q-8,-5 -12,-15 Q-8,-20 0,-25 Q8,-20 12,-15 Q8,-5 0,0" 
                fill={`url(#monsteraGrad${x})`} />
          {/* Holes */}
          <ellipse cx="-4" cy="-12" rx="2" ry="3" fill="#1a4a2e" opacity="0.8" />
          <ellipse cx="3" cy="-8" rx="1.5" ry="2.5" fill="#1a4a2e" opacity="0.8" />
          {/* Vein */}
          <path d="M0,0 L0,-22" stroke="#2E7D32" strokeWidth="0.5" opacity="0.6" />
          <path d="M0,-8 L-4,-12" stroke="#2E7D32" strokeWidth="0.3" opacity="0.5" />
          <path d="M0,-14 L4,-18" stroke="#2E7D32" strokeWidth="0.3" opacity="0.5" />
        </g>
      );
    }
    
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotation + sway}) scale(${scale})`}>
        <defs>
          <linearGradient id={`leafGrad${x}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#66BB6A" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>
        <ellipse cx="0" cy="-10" rx="4" ry="12" fill={`url(#leafGrad${x})`} />
        <path d="M0,2 L0,-20" stroke="#1B5E20" strokeWidth="0.6" />
      </g>
    );
  };

  // Bromeliad plant
  const Bromeliad = ({ x, y, scale = 1 }) => {
    const sway = Math.sin(time * 0.015 + x) * 2;
    
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <defs>
          <linearGradient id={`bromeliadGrad${x}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8E24AA" />
            <stop offset="30%" stopColor="#7B1FA2" />
            <stop offset="70%" stopColor="#4A148C" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>
        </defs>
        {/* Leaves radiating out */}
        {[-40, -20, 0, 20, 40].map((angle, i) => (
          <path key={i}
            d={`M0,0 Q${Math.sin((angle + sway) * Math.PI / 180) * 8},-10 ${Math.sin((angle + sway) * Math.PI / 180) * 12},-20`}
            stroke={`url(#bromeliadGrad${x})`}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {/* Center water cup */}
        <ellipse cx="0" cy="-2" rx="3" ry="1.5" fill="#1565C0" opacity="0.6" />
      </g>
    );
  };

  // Fern
  const Fern = ({ x, y, scale = 1 }) => {
    const sway = Math.sin(time * 0.025 + x) * 4;
    
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {[...Array(7)].map((_, i) => {
          const angle = -60 + i * 20 + sway;
          const length = 15 + Math.sin(i) * 5;
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <path d={`M0,0 Q2,-${length/2} 0,-${length}`} stroke="#2E7D32" strokeWidth="0.8" fill="none" />
              {[...Array(8)].map((_, j) => (
                <ellipse key={j} 
                  cx={j % 2 === 0 ? -1.5 : 1.5} 
                  cy={-2 - j * (length/10)} 
                  rx="1.5" ry="0.5" 
                  fill="#43A047" 
                  transform={`rotate(${j % 2 === 0 ? -30 : 30})`}
                />
              ))}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl aspect-[16/10] rounded-xl overflow-hidden shadow-2xl">
        {/* Glass tank frame */}
        <div className="absolute inset-0 border-[12px] border-gray-800 rounded-xl z-20 pointer-events-none"
             style={{ 
               borderImage: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%) 1',
               boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.8)'
             }} />
        
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Lighting and atmosphere */}
            <linearGradient id="atmosphereGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d2818" />
              <stop offset="30%" stopColor="#1a4a2e" />
              <stop offset="60%" stopColor="#2d5a3f" />
              <stop offset="100%" stopColor="#1a3a28" />
            </linearGradient>
            
            <radialGradient id="topLight" cx="30%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E2723" />
              <stop offset="50%" stopColor="#2C1810" />
              <stop offset="100%" stopColor="#1a0f0a" />
            </linearGradient>
            
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1976D2" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0D47A1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a3d6e" />
            </linearGradient>
            
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="waterReflection">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>

            {/* NEW: Photorealistic Filters */}
            <filter id="depthBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            
            <filter id="contactShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" />
            </filter>
            
            <filter id="organicNoise">
              <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
              <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
            </filter>

            <filter id="wetHighlight">
              <feGaussianBlur stdDeviation="0.4" />
            </filter>

            <filter id="glassDistortion">
              <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>

            {/* NEW: Cinematic Filters */}
            <filter id="filmGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="noise" result="blackNoise" />
              <feComponentTransfer in="blackNoise" result="alphaNoise">
                 <feFuncA type="linear" slope="0.05" />
              </feComponentTransfer>
              <feBlend mode="overlay" in="alphaNoise" in2="SourceGraphic" />
            </filter>

            {/* Moss texture */}
            <pattern id="mossPattern" patternUnits="userSpaceOnUse" width="4" height="4">
              <circle cx="1" cy="1" r="0.8" fill="#4CAF50" />
              <circle cx="3" cy="2" r="0.6" fill="#66BB6A" />
              <circle cx="2" cy="3" r="0.7" fill="#388E3C" />
            </pattern>
          </defs>

          {/* Background atmosphere */}
          <rect x="0" y="0" width="100" height="100" fill="url(#atmosphereGrad)" />
          <rect x="0" y="0" width="100" height="50" fill="url(#topLight)" />
          
          {/* Distant misty foliage layers - BLURRED FOR DEPTH */}
          <g filter="url(#depthBlur)">
            {[...Array(25)].map((_, i) => (
              <ellipse key={`mist${i}`}
                cx={i * 8 - 10 + Math.sin(i * 0.7) * 10}
                cy={12 + Math.cos(i * 1.2) * 8}
                rx={12 + Math.random() * 8}
                ry={8 + Math.random() * 5}
                fill={`hsl(${130 + Math.sin(i) * 15}, ${35 + Math.random() * 15}%, ${12 + Math.random() * 8}%)`}
                opacity={0.7}
              />
            ))}
            
            {/* Mid-ground foliage */}
            {[...Array(20)].map((_, i) => (
              <ellipse key={`mid${i}`}
                cx={i * 10 - 5 + Math.cos(i * 1.3) * 8}
                cy={25 + Math.sin(i * 1.5) * 10}
                rx={10 + Math.random() * 6}
                ry={7 + Math.random() * 4}
                fill={`hsl(${125 + Math.sin(i * 0.8) * 20}, ${40 + Math.random() * 20}%, ${18 + Math.random() * 10}%)`}
              />
            ))}
          </g>

          {/* Decorative back plants */}
          <Fern x={8} y={50} scale={1.2} />
          <Fern x={92} y={48} scale={1} />
          <Bromeliad x={25} y={42} scale={1.1} />
          <Bromeliad x={75} y={38} scale={0.9} />

          {/* Ground/substrate */}
          <ellipse cx="50" cy="108" rx="65" ry="28" fill="url(#groundGrad)" />
          
          {/* Substrate texture */}
          {[...Array(40)].map((_, i) => (
            <ellipse key={`substrate${i}`}
              cx={5 + Math.random() * 90}
              cy={82 + Math.random() * 15}
              rx={0.5 + Math.random() * 1}
              ry={0.3 + Math.random() * 0.5}
              fill={`hsl(${20 + Math.random() * 20}, ${30 + Math.random() * 20}%, ${15 + Math.random() * 15}%)`}
            />
          ))}
          
          {/* Moss patches */}
          <ellipse cx="60" cy="84" rx="15" ry="4" fill="url(#mossPattern)" opacity="0.9" />
          <ellipse cx="35" cy="86" rx="10" ry="3" fill="url(#mossPattern)" opacity="0.8" />
          <ellipse cx="82" cy="87" rx="12" ry="3.5" fill="url(#mossPattern)" opacity="0.85" />

          {/* Water pool */}
          <ellipse cx="22" cy="89" rx="18" ry="7" fill="url(#waterGrad)" />
          {/* Water surface highlight */}
          <ellipse cx="18" cy="87" rx="8" ry="2" fill="white" opacity="0.15" />
          
          {/* Ripples */}
          {ripples.map(r => (
            <ellipse key={r.id} cx={r.x} cy={r.y} rx={r.size} ry={r.size * 0.35}
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" opacity={r.opacity} />
          ))}

          {/* Rocks with detail */}
          <g filter="url(#organicNoise)">
            <ellipse cx="52" cy="88" rx="7" ry="4.5" fill="black" filter="url(#contactShadow)" opacity="0.6" />
            <ellipse cx="52" cy="88" rx="6" ry="4" fill="#5D4037" />
            <ellipse cx="52" cy="87" rx="5" ry="3" fill="#6D4C41" />
            <ellipse cx="50" cy="86" rx="2" ry="1" fill="#8D6E63" opacity="0.5" />
          </g>
          <g filter="url(#organicNoise)">
            <ellipse cx="68" cy="90" rx="5" ry="3" fill="black" filter="url(#contactShadow)" opacity="0.6" />
            <ellipse cx="68" cy="90" rx="4" ry="2.5" fill="#4E342E" />
            <ellipse cx="67" cy="89.5" rx="3" ry="2" fill="#5D4037" />
          </g>
          <g>
            <ellipse cx="8" cy="86" rx="3.5" ry="2.5" fill="#5D4037" />
            <ellipse cx="7.5" cy="85.5" rx="2.5" ry="1.5" fill="#6D4C41" />
          </g>

          {/* Wood/branch */}
          <path d="M40,88 Q45,80 55,75 Q65,72 75,74" stroke="#4E342E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M40,88 Q45,80 55,75 Q65,72 75,74" stroke="#6D4C41" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M55,75 Q52,68 48,60" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Tropical leaves */}
          <TropicalLeaf x={12} y={55} rotation={-20} scale={1.2} type="monstera" />
          <TropicalLeaf x={88} y={50} rotation={15} scale={1.1} type="monstera" />
          <TropicalLeaf x={50} y={38} rotation={5} scale={1} type="monstera" />
          <TropicalLeaf x={30} y={62} rotation={-10} scale={0.9} type="simple" />
          <TropicalLeaf x={72} y={58} rotation={12} scale={0.95} type="simple" />

          {/* Turtles - added shadow logic inside RealisticTurtle if needed, but here simple shadow pass */}
          {turtles.map(turtle => (
            <g key={`shadow-${turtle.id}`} transform={`translate(${turtle.x}, ${turtle.y + 2}) scale(${turtle.direction}, 1)`}>
               <ellipse cx="0" cy="0" rx="5" ry="2.5" fill="black" filter="url(#contactShadow)" opacity="0.4" />
            </g>
          ))}
          {turtles.map(turtle => (
            <RealisticTurtle key={turtle.id} turtle={turtle} />
          ))}

          {/* Frogs */}
          {frogs.map(frog => {
            if (frog.type === 'redEyed') return <RedEyedTreeFrog key={frog.id} x={frog.x} y={frog.y} eyeOpen={frog.eyeOpen} breathe={frog.breathe} />;
            if (frog.type === 'poisonDart') return <PoisonDartFrog key={frog.id} x={frog.x} y={frog.y} eyeOpen={frog.eyeOpen} breathe={frog.breathe} />;
            return <GreenTreeFrog key={frog.id} x={frog.x} y={frog.y} eyeOpen={frog.eyeOpen} breathe={frog.breathe} />;
          })}

          {/* Fireflies with glow */}
          {fireflies.map(f => {
            const glow = 0.3 + 0.7 * Math.abs(Math.sin(f.phase + time * 0.05 * f.speed));
            return (
              <g key={f.id} filter="url(#softGlow)">
                <circle cx={f.x + Math.sin(time * 0.02 + f.id) * 2} 
                        cy={f.y + Math.cos(time * 0.025 + f.id) * 1.5}
                        r={0.8 + glow * 0.4}
                        fill={`rgba(255, 255, 180, ${glow})`} />
              </g>
            );
          })}

          {/* Foreground leaves for depth */}
          <ellipse cx={-8} cy={72 + Math.sin(time * 0.015) * 2} rx="18" ry="10" fill="#1B5E20" opacity="0.85" />
          <ellipse cx={108} cy={68 + Math.cos(time * 0.015) * 2} rx="15" ry="9" fill="#1B5E20" opacity="0.85" />

          {/* Glass reflections and condensation */}
          <rect x="0" y="0" width="100" height="100" fill="white" opacity="0.02" />
          
          {/* Water droplets on glass */}
          <g filter="url(#glassDistortion)">
            {waterDrops.map(drop => (
              <g key={drop.id}>
                <ellipse cx={drop.x} cy={drop.y} rx={drop.size * 0.7} ry={drop.size}
                  fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.1" />
                <ellipse cx={drop.x - drop.size * 0.2} cy={drop.y - drop.size * 0.3} 
                  rx={drop.size * 0.2} ry={drop.size * 0.3}
                  fill="white" opacity="0.8" />
              </g>
            ))}
          </g>
          
          
          {/* VOLUMETRIC GOD RAYS */}
          <g style={{ mixBlendMode: 'overlay' }} pointerEvents="none">
             {[...Array(5)].map((_, i) => (
                <path key={`ray${i}`}
                  d={`M${20 + i * 15},-10 L${10 + i * 20 - 15},90 L${10 + i * 20 + 5},90 Z`}
                  fill="url(#topLight)"
                  opacity={0.3 + Math.sin(time * 0.1 + i) * 0.1}
                  filter="url(#depthBlur)"
                />
             ))}
          </g>

          {/* Top light reflection on glass */}
          <ellipse cx="30" cy="8" rx="25" ry="6" fill="white" opacity="0.04" />
          <ellipse cx="75" cy="12" rx="15" ry="4" fill="white" opacity="0.03" />
        </svg>

        {/* CINEMATIC OVERLAYS (HTML Layer) */}
        
        {/* Film Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-30"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
             }} />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30"
             style={{
               background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(10, 20, 10, 0.4) 100%)'
             }} />

        {/* Chromatic Aberration on Glass Edges (Simulated with border) */}
        <div className="absolute inset-0 border-[12px] border-transparent rounded-xl z-20 pointer-events-none mix-blend-screen"
             style={{
               boxShadow: 'inset 2px 0 0 rgba(255,0,0,0.3), inset -2px 0 0 rgba(0,255,255,0.3)'
             }} />

        {/* Glass shine overlay */}
        <div className="absolute inset-0 pointer-events-none z-10"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)'
             }} />
        
        {/* Ambient light glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 pointer-events-none z-10"
             style={{
               background: 'radial-gradient(ellipse at center, rgba(144,238,144,0.1) 0%, transparent 70%)'
             }} />
      </div>
    </div>
  );
};

export default RealisticTerrarium;
