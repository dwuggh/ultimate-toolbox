import { Graphics, Point } from "pixi.js";

export { Point } from 'pixi.js';

export class StrokeData {
	start: Point = new Point(0, 0);
	points: Point[] = [];

	constructor(start: Point, points: Point[]) {
		this.start = start;
		this.points = points;
	}
}

interface BezierCurve {
	start: Point;
	end: Point;
	control: Point;
	control2?: Point;
}

export class CurveData {
	points: Point[] = [];

	constructor(points?: Point[]) {
		this.points = points || [];
	}

	addPoint(point: Point) {
		return new CurveData([...this.points, point]);
	}

	draw(g: Graphics, drawPoint: boolean = false) {
		if (this.points.length < 3) return;
		const start = this.points[0];
		const end = this.points[1];
		const data: BezierCurve = {
			start,
			end,
			control: this.points[2]
		}
		if (this.points.length === 4) {
			data.control2 = this.points[3];
		}

		g.moveTo(data.start.x, data.start.y);
		if (data.control2) {
			g.bezierCurveTo(data.control.x, data.control.y, data.control2.x, data.control2.y, data.end.x, data.end.y);
		} else {
			g.quadraticCurveTo(data.control.x, data.control.y, data.end.x, data.end.y);
		}

		if (drawPoint) {
			g.circle(start.x, start.y, 1);
			g.circle(end.x, end.y, 1);
			g.circle(data.control.x, data.control.y, 1);
			if (data.control2) {
				g.circle(data.control2.x, data.control2.y, 1);
			}
		}
	}
}