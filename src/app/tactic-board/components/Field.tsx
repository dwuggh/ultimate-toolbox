'use client'

import { Container, FederatedPointerEvent, Graphics, Sprite, Text, } from 'pixi.js';
import { extend } from '@pixi/react';
import React, { useRef, useCallback } from 'react';
import Player from './Player';
import Frisbee from './Frisbee';
import { Curve, Line } from './Strokes';
import SelectState from '@/lib/select';
import { StrokeHookResult } from '@/hooks/useStroke';
import useApp from '@/hooks/useApp';
import { Brush, BrushType } from '@/lib/brush';
import { ChessMap, FrisbeeData, Positioned, useTacticBoardStore } from '@/store/tactic-board';

extend({ Container, Graphics, Text, Sprite });

interface FieldProps {
  chesses: ChessMap,
  frisbees: Positioned<FrisbeeData>[],
  brush: Brush,
  strokeHook: StrokeHookResult,
  selectState: React.RefObject<SelectState>
}


const Field = ({chesses, frisbees, brush, strokeHook, selectState }: FieldProps) => {
  useApp(true);
  const courtRef = useRef<Container>(null);



  const onPointerDown = (event: FederatedPointerEvent) => {
    if (brush.type == BrushType.PEN) {
      const court = courtRef.current;
      if (!court) return;
      const pos = court.toLocal(event.global);
      strokeHook.onPointerDown(pos);
      return;
    }

    const target = event.target;
    // if target is the court itself, unset selection
    if (target == courtRef.current) {
      selectState.current.unselect();
      return;
    }

    selectState.current.select(target, true, event.global);

  }

  const onPointerMove = (event: FederatedPointerEvent) => {
    const court = courtRef.current;
    if (!court) return;
    const pos = court.toLocal(event.global);
    strokeHook.onPointerMove(pos);


    selectState.current.move(event.global);
  }

  const tacticBoardStore = useTacticBoardStore();

  const onPointerUp = (event: FederatedPointerEvent) => {
    strokeHook.onPointerUp();

    if (selectState.current) {
      if (selectState.current.target) {

        const target = selectState.current.target;
        const point = target.position;
        const objectType = (target as any).objectType;
        const objectId = (target as any).objectId;
        tacticBoardStore.updatePosition(objectType, objectId, point, (target as any).color);
      }
      selectState.current.unsetDrag();
    }
  }

  const onClick = (event: FederatedPointerEvent) => {

    const court = courtRef.current;
    if (!court) return;
    const pos = court.toLocal(event.global);
    strokeHook.onClick(pos);
  }


  const draw = useCallback((court: Graphics) => {

    const width = 100;
    const height = 37;
    const x0 = 0;
    const y0 = 0;
    const lineWidth = 0.5;
    court.rect(x0, y0, 100, 37);
    court.fill(0x35cc5a);
    court.stroke({ width: lineWidth, color: 0x000000 });

    court.moveTo(x0 + width * 0.18, y0);
    court.lineTo(x0 + width * 0.18, y0 + height);
    court.stroke({ width: lineWidth, color: 0x000000 });

    court.moveTo(x0 + width * 0.82, y0);
    court.lineTo(x0 + width * 0.82, y0 + height);
    court.stroke({ width: lineWidth, color: 0x000000 });

  }, [])


  return (
    <pixiContainer ref={courtRef}
      onClick={onClick}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} eventMode='static' scale={8}>
      <pixiGraphics draw={draw} position={{ x: 10, y: 10 }}>
      </pixiGraphics>
      {
        [...chesses.values()].flat().map((player) => {
          return <Player data={player} radius={2} />
        })
      }
      {frisbees.map((frisbee) => (
        <Frisbee key={frisbee.object.id} data={frisbee} radius={1} />
      ))}
      {strokeHook.lines.map((line, i) => (
        <Line data={line} id={i} />
      ))}
      {strokeHook.currentLine && <Line data={strokeHook.currentLine} id={-1} />}
      {strokeHook.curves.map((curve, i) => (
        <Curve data={curve} id={i} />
      ))}
    </pixiContainer>
  );
};


export default Field;
