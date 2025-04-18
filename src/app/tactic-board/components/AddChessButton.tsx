'use client';
import { useCallback, useState } from "react";
import { Point } from "pixi.js";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { ChessColor, ChessData, Positioned, useTacticBoardStore } from '@/store/tactic-board';

export default function AddChessButton() {
  const addChess = useTacticBoardStore(state => state.addChess);
  const [color, setColor] = useState<ChessColor>(ChessColor.RED);

  const onClick = useCallback(() => {
    const newPlayer = new Positioned(new ChessData(color, 0), new Point(20, 20))
    addChess(newPlayer)
  }, [color, addChess])

  return (
    <div className="flex gap-2">
      <Select 
        value={color as any}
        onValueChange={(val) => setColor(val as unknown as ChessColor)}
      >
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
        <SelectGroup>
        {Object.entries(ChessColor)
          .filter(([key]) => isNaN(Number(key)))
          .map(([key, value]) => (
            <SelectItem key={key} value={value as string}>
              {key.toLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={onClick} variant='ghost'>
        <LuPlus
        className="h-5 text-blue-500 hover:text-blue-700 transition-colors" />
      </Button>
    </div>
  );
}
