'use client'
import { CurveData, StrokeData } from "@/lib/strokes";
import { Graphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";


const Line = ({data, id}: {data: StrokeData, id: number}) => {
	const draw = useCallback((g: Graphics) => {
		const start = data.start;
		const points = data.points;
		g.clear();
		g.moveTo(start.x, start.y);
		g.setStrokeStyle({color: 0xff0000, pixelLine: true, width: 2});
		for (let i = 0; i < points.length; i++) {
			g.lineTo(points[i].x, points[i].y);
		}
		g.stroke();

	}, [data])
 	const ref = useRef<Graphics>(null);
	useEffect(() => {
    	if (!ref.current) return;
		(ref.current as any).objectType = 'stroke';
		(ref.current as any).objectId = id;
	})
	return <pixiGraphics ref={ref} draw={draw} eventMode="static"></pixiGraphics>
}

const Curve = ({data, id}: {data: CurveData, id: number}) => {
	const draw = useCallback((g: Graphics) => {
		g.clear();
		g.setStrokeStyle({color: 0xff0000, pixelLine: true, width: 2});
		data.draw(g, true);
		g.stroke();
	}, [data])
 	const ref = useRef<Graphics>(null);
	useEffect(() => {
    	if (!ref.current) return;
		(ref.current as any).objectType = 'curve';
		(ref.current as any).objectId = id;
	})
	return <pixiGraphics ref={ref} draw={draw} eventMode="static"></pixiGraphics>
}



export {
	Line,
	Curve,
}