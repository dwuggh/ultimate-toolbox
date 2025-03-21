import { Button } from "@pixi/ui";
import { Assets, FederatedPointerEvent, Graphics, Rectangle, Sprite } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";

import feather, { FeatherIconNames } from "feather-icons";

interface PixiButtonProps {
  type: FeatherIconNames,
  text: string;
  x?: number;
  y?: number;
  onClick?: (e?: FederatedPointerEvent) => void;
}
const PixiButton = (props: PixiButtonProps) => {
	const buttonRef = useRef<Button | null>(null); // Ref to hold the @pixi/ui Button instance
	const spriteRef = useRef<Graphics | null>(null);

	const draw = useCallback((g: Graphics) => {
		const svg = feather.icons[props.type].toSvg({stroke: 'black', "stroke-width": 1.5});
		console.log("svg", svg);
		g.svg(svg);
		g.position.set(props.x || 0, props.y || 0);
		spriteRef.current = g;
		
	}, [])

	useEffect(() => {
		console.log("effect")
		if (!spriteRef.current) {
			return;
		}

		spriteRef.current.onclick = (e) => {
			console.log("click");
			props.onClick?.(e);
		}

		const button = new Button(spriteRef.current);

		buttonRef.current = button;
	}, [])

	return (
		<pixiGraphics draw={draw} ref={spriteRef}/>
	)
}

export default PixiButton;