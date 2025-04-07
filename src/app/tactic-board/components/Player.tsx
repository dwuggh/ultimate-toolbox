'use client'
import { Container, FederatedEventHandler, Graphics, Point } from "pixi.js";
import { memo, useCallback, useEffect, useRef, useState } from "react";

export enum ChessColor {
  RED = 0xFF0000,
  GREEN = 0x00FF00,
  BLUE = 0x0000FF,
  YELLOW = 0xFFFF00,
  PURPLE = 0xFF00FF,
  CYAN = 0x00FFFF
}
export class ChessData {
  color: ChessColor;
  id: number;
  initialPosition: Point = new Point(0, 0);

  constructor(color: ChessColor, id: number, initialPosition?: Point) {
    this.color = color;
    this.id = id;
	this.initialPosition = initialPosition || new Point(0, 0);
  }
}

export type ChessMap = Map<ChessColor, ChessData[]>

export interface PlayerProps extends ChessData {
	radius: number;
	onPointerDown?: FederatedEventHandler,
	onPointerMove?: FederatedEventHandler,
	onPointerUp?: FederatedEventHandler,
}

function arePlayersEqual(p1: PlayerProps, p2: PlayerProps) {
	return p1.color === p2.color && p1.id === p2.id;
}

const Player = memo(({ color, initialPosition, id, radius, onPointerDown, onPointerMove, onPointerUp }: PlayerProps) => {
	const ref = useRef<Container>(null);
	const drawCallback = useCallback((player: Graphics) => {
		player.circle(0, 0, radius);
		player.fill(color);
		player.stroke({ width: 0.2, color: 0 });
	}, []);

	useEffect(() => {
		if (!ref.current) return;
		ref.current.position.set(initialPosition.x, initialPosition.y);
		(ref.current as any).objectType = 'player';
		(ref.current as any).objectId = id;
		(ref.current as any).color = color;

	}, []);

	console.log("render player", id);
	return (
		<pixiContainer eventMode="dynamic"
				ref={ref}
			onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
			cursor="pointer"
		>
			<pixiGraphics
				draw={drawCallback}
				/>
			<pixiText text={id.toString()}
				x={-radius / 2} y={-radius / 2} zIndex={2}
				style={{ fontFamily: 'Arial', fontSize: 20 }} scale={0.1}/>
		</pixiContainer>
	);
}, arePlayersEqual);

export default Player;
