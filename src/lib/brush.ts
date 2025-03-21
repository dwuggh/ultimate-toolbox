

export enum BrushType {
	POINTER = "pointer",
	PEN = "pen",
	CURVE3 = "curve3",
	CURVE4 = "curve4",
	CIRCLE = "circle",
}

export enum LineType {
	SOLID = "solid",
	DASHED = "dashed"
}

export enum Color {
	RED = 0xff0000,
	GREEN = 0x00ff00,
	BLUE = 0x0000ff
}

export class Brush {
	type: BrushType = BrushType.POINTER;
	color: Color = Color.RED;
	lineType: LineType = LineType.SOLID;
	
	constructor(type: BrushType = BrushType.POINTER, color: Color = Color.RED, lineType: LineType = LineType.SOLID) {
		this.type = type;
		this.color = color;
		this.lineType = lineType;
	}

	changeType(type: BrushType): Brush {
		return new Brush(type, this.color, this.lineType);
	}

	changeColor(color: Color): Brush {
		return new Brush(this.type, color, this.lineType);
	}

	changeLine(lineType: LineType): Brush {
		return new Brush(this.type, this.color, lineType);
	}
}