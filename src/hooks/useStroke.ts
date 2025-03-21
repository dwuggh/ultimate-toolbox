import { Brush, BrushType } from "@/lib/brush";
import { StrokeData, Point, CurveData } from "@/lib/strokes";
import { Graphics } from "pixi.js";
import React, { RefObject, useRef, useState, useCallback } from "react";

export const drawStroke = (g: Graphics, line: StrokeData) => {
	g.clear();
	g.moveTo(line.start.x, line.start.y);
	g.setStrokeStyle({ color: 0xff0000, pixelLine: true, width: 2 });
	for (let i = 0; i < line.points.length; i++) {
		g.lineTo(line.points[i].x, line.points[i].y);
	}
	g.stroke();
}

export interface StrokeHookResult {
  lines: StrokeData[];
  currentLine: StrokeData | null;
  curves: CurveData[];
  setLines: React.Dispatch<React.SetStateAction<StrokeData[]>>;
  deleteLine: (id: number) => void;
  onPointerDown: (pos: Point) => void;
  onPointerMove: (pos: Point) => void;
  onPointerUp: () => void;
  onClick: (pos: Point) => void;
  clear: () => void;
}

export default function useStroke(brush: Brush) {
	const isDrawing = useRef(false);
	const [lines, setLines] = useState<StrokeData[]>([]);
	const [currentLine, setCurrentLine] = useState<StrokeData | null>(null);

	const DrawingCurveRemains = useRef(0);
	const [curves, setCurves] = useState<CurveData[]>([]);
	const [currentCurve, setCurrentCurve] = useState<CurveData | null>(null);

	const deleteLine = useCallback((id: number) => {
		setLines((prev) => prev.filter((line, index) => index !== id));
	}, []);


	const onPointerDown = useCallback((pos: Point) => {
		if (brush.type === BrushType.PEN) {
			isDrawing.current = true;
			setCurrentLine(new StrokeData(pos, []));
		}
	}, [brush]);

	const onPointerMove = useCallback((pos: Point) => {
		if (brush.type === BrushType.PEN && isDrawing.current) {
			setCurrentLine((prev) => {
				if (!prev) return null;
				return new StrokeData(prev.start, [...prev.points, pos]);
			})
		}
	}, [brush]);

	const onPointerUp = useCallback(() => {
		if (brush.type === BrushType.PEN && isDrawing.current) {
			isDrawing.current = false;
			setLines((prev) => [...prev, currentLine!]);
			setCurrentLine(null);
		}
	}, [brush, currentLine]);

	const onClick = useCallback((pos: Point) => {
		if (brush.type === BrushType.CURVE3) {
			console.log("onClick", isDrawing.current, DrawingCurveRemains.current, pos); // ADDED LOGGING
			if (!isDrawing.current && DrawingCurveRemains.current == 0) {
				isDrawing.current = true;
				DrawingCurveRemains.current = 3;
				setCurrentCurve(new CurveData());
			}
			if (isDrawing.current && DrawingCurveRemains.current > 0) {
				DrawingCurveRemains.current--;	
				const point = new Point(pos.x, pos.y);
				if (DrawingCurveRemains.current == 0) {
					isDrawing.current = false;
					console.log("run")
					setCurrentCurve((prev) => {
						console.log("setCurrentCurve (0)", prev, point); // ADDED LOGGING
						if (!prev) {
							return prev;
						}
						const curve = prev.addPoint(point);
						setCurves((prevCurves) => [...prevCurves, curve]);
						return null
					});
				} else {
					setCurrentCurve((prev) => {
						console.log("setCurrentCurve (>0)", prev, point); // ADDED LOGGING
						return prev?.addPoint(point) || null
					});
				}
			}
		}

	}, [brush])

	const clear = useCallback(() => {
		setLines([]);
		setCurrentLine(null);
	}, []);


	return {
		lines,
		setLines,
		currentLine,
		curves,
		deleteLine,
		onPointerDown,
		onPointerMove, 
		onPointerUp,
		onClick,
		clear,
	} as StrokeHookResult;
}
