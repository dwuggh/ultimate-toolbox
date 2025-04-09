'use client'
import { FrisbeeData, Positioned } from "@/store/tactic-board";
import { Container, FederatedEventHandler, Graphics, Point } from "pixi.js";
import { memo, useCallback, useEffect, useRef } from "react";


export interface FrisbeeProps {
  data: Positioned<FrisbeeData>;
  radius: number;
  onPointerDown?: FederatedEventHandler,
  onPointerMove?: FederatedEventHandler,
  onPointerUp?: FederatedEventHandler,
}


const Frisbee = ({ data, radius, onPointerDown, onPointerMove, onPointerUp }: FrisbeeProps) => {
  const ref = useRef<Container>(null);
  const drawCallback = useCallback((frisbee: Graphics) => {
    // Draw outer circle (white)
    frisbee.circle(0, 0, radius);
    frisbee.fill(0xFFFFFF);
    
    // // Draw inner circle (red)
    // frisbee.circle(0, 0, radius * 0.7);
    // frisbee.fill(0xFF0000);
    
    // // Draw center circle (white)
    // frisbee.circle(0, 0, radius * 0.3);
    // frisbee.fill(0xFFFFFF);
    
    // // Draw border
    // frisbee.stroke({ width: 0.2, color: 0 });
    console.log(data.position);
    // frisbee.position.set(data.position.x, data.position.y);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
		(ref.current as any).objectType = 'frisbee';
		(ref.current as any).objectId = data.object.id;
  }, []);

  return (
    <pixiContainer 
      eventMode="dynamic"
      ref={ref}
      onPointerDown={onPointerDown} 
      onPointerMove={onPointerMove} 
      onPointerUp={onPointerUp}
      cursor="pointer"
      position={data.position}
    >
      <pixiGraphics
        draw={drawCallback}
      />
    </pixiContainer>
  );
}

export default Frisbee;
