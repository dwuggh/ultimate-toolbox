import { Brush, BrushType, LineType } from "@/lib/brush";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { LuCircle, LuPen, LuPointer, LuSpline } from "react-icons/lu";
import { AiOutlineDash, AiOutlineLine, } from "react-icons/ai";

const BRUSH_TYPE_ICONS = {
	[BrushType.PEN]: <LuPen />,
	[BrushType.POINTER]: <LuPointer />,
	[BrushType.CURVE3]: <LuSpline />,
	[BrushType.CURVE4]: <LuSpline />,
	[BrushType.CIRCLE]: <LuCircle />
}

const BRUSH_LINE_ICONS = {
	[LineType.SOLID]: <AiOutlineLine />,
	[LineType.DASHED]: <AiOutlineDash />
}

const BrushMenu = <T extends string>({
  currentValue,
  values,
  icons,
  onChange,
}: {
  currentValue: T;
  values: T[];
  icons: Record<T, React.ReactNode>;
  onChange: (value: T) => void;
}) => (
  <MenubarMenu>
    <MenubarTrigger className="p-2 h-auto data-[state=open]:bg-accent focus:bg-accent">
      <div className="h-5 w-5 flex items-center justify-center">
        {icons[currentValue]}
      </div>
    </MenubarTrigger>
    <MenubarContent className="min-w-[40px] p-1">
      {values.map((value) => (
        <MenubarItem
          key={value}
          className="p-2 justify-center focus:bg-accent/50"
          onClick={() => onChange(value)}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            {icons[value]}
          </div>
        </MenubarItem>
      ))}
    </MenubarContent>
  </MenubarMenu>
);

interface BrushSelectorProps {
  brush: Brush;
  onBrushChange: (newBrush: Brush) => void;
}

export default function BrushSelector({ brush, onBrushChange }: BrushSelectorProps) {
	const onTypeChange = (type: BrushType) => {
		onBrushChange(brush.changeType(type));
	};

	const onLineChange = (type: LineType) => {
		onBrushChange(brush.changeLine(type));
	};
  return (
    <Menubar className="p-1 h-auto rounded-md border-none bg-transparent">
	  <BrushMenu currentValue={brush.lineType} values={Object.values(LineType)} icons={BRUSH_LINE_ICONS} onChange={onLineChange} />
	  <BrushMenu currentValue={brush.type} values={Object.values(BrushType)} icons={BRUSH_TYPE_ICONS} onChange={onTypeChange} />
    </Menubar>
  )
}