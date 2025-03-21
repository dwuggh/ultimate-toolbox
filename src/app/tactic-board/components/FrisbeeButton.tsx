import { useCallback, useState } from "react";
import { Point } from "pixi.js";
import { Button } from "@/components/ui/button";
import { FrisbeeData } from "./Frisbee";
import { LuCircle } from "react-icons/lu";

interface Props {
  addFrisbee: (newFrisbee: FrisbeeData) => void
}

export default function FrisbeeButton({addFrisbee}: Props) {
  const [nextId, setNextId] = useState(0);
  
  const onClick = useCallback(() => {
    const newFrisbee = new FrisbeeData(nextId, new Point(20, 20));
    addFrisbee(newFrisbee);
    setNextId(prevId => prevId + 1);
  }, [addFrisbee, nextId]);

  return (
    <Button onClick={onClick} variant='ghost'>
      <LuCircle
        className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors"
      />
    </Button>
  );
}
