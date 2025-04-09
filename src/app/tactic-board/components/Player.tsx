'use client'
import { ChessData, Positioned } from "@/store/tactic-board";
import { Container, FederatedEventHandler, Graphics, Point } from "pixi.js";
import { memo, useCallback, useEffect, useRef, useState } from "react";


export interface PlayerProps {
	data: Positioned<ChessData>;
	radius: number;
	onPointerDown?: FederatedEventHandler,
	onPointerMove?: FederatedEventHandler,
	onPointerUp?: FederatedEventHandler,
}


const Player = ({ data, radius, onPointerDown, onPointerMove, onPointerUp }: PlayerProps) => {
	const ref = useRef<Container>(null);
	const drawCallback = useCallback((player: Graphics) => {
		player.circle(0, 0, radius);
		player.fill(data.object.color);
		player.stroke({ width: 0.2, color: 0 });
	}, []);

	useEffect(() => {
		if (!ref.current) return;
		(ref.current as any).objectType = 'player';
		(ref.current as any).objectId = data.object.id;
		(ref.current as any).color = data.object.color;

	}, []);

	return (
		<pixiContainer eventMode="dynamic"
				ref={ref}
			onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
			cursor="pointer"
			position={data.position}
		>
			<pixiGraphics
				draw={drawCallback}
				/>
			<pixiText text={data.object.id.toString()}
				x={-radius / 2} y={-radius / 2} zIndex={2}
				style={{ fontFamily: 'Arial', fontSize: 20 }} scale={0.1}/>
		</pixiContainer>
	);
}

export default Player;
