'use client'
import { FrisbeeData } from "@/store/tactic-board";
import { Container, FederatedEventHandler, Graphics, Point } from "pixi.js";
import { memo, useCallback, useEffect, useRef } from "react";


export interface FrisbeeProps extends FrisbeeData {
  radius: number;
  onPointerDown?: FederatedEventHandler,
  onPointerMove?: FederatedEventHandler,
  onPointerUp?: FederatedEventHandler,
}

function areFrisbeesEqual(f1: FrisbeeProps, f2: FrisbeeProps) {
  return f1.id === f2.id;
}

const Frisbee = memo(({ initialPosition, id, radius, onPointerDown, onPointerMove, onPointerUp }: FrisbeeProps) => {
  const ref = useRef<Container>(null);
  const drawCallback = useCallback((frisbee: Graphics) => {
    // Draw outer circle (white)
    frisbee.circle(0, 0, radius);
    frisbee.fill(0xFFFFFF);
    
    // Draw inner circle (red)
    frisbee.circle(0, 0, radius * 0.7);
    frisbee.fill(0xFF0000);
    
    // Draw center circle (white)
    frisbee.circle(0, 0, radius * 0.3);
    frisbee.fill(0xFFFFFF);
    
    // Draw border
    frisbee.stroke({ width: 0.2, color: 0 });
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.set(initialPosition.x, initialPosition.y);
		(ref.current as any).objectType = 'frisbee';
		(ref.current as any).objectId = id;
  }, []);

  console.log("render frisbee", id);
  return (
    <pixiContainer 
      eventMode="dynamic"
      ref={ref}
      onPointerDown={onPointerDown} 
      onPointerMove={onPointerMove} 
      onPointerUp={onPointerUp}
      cursor="pointer"
    >
      <pixiGraphics
        draw={drawCallback}
      />
    </pixiContainer>
  );
}, areFrisbeesEqual);

export default Frisbee;
