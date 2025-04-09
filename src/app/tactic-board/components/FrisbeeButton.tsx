'use client'
import { useCallback } from "react"
import { Point } from "pixi.js"
import { Button } from "@/components/ui/button"
import { LuCircle } from "react-icons/lu"
import { FrisbeeData, Positioned, useTacticBoardStore } from '@/store/tactic-board'

export default function FrisbeeButton() {
  const addFrisbee = useTacticBoardStore(state => state.addFrisbee)
  
  const onClick = useCallback(() => {
    const newFrisbee = new Positioned(new FrisbeeData(Date.now()), new Point(20, 20))
    addFrisbee(newFrisbee)
  }, [addFrisbee])

  return (
    <Button onClick={onClick} variant='ghost'>
      <LuCircle
        className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors"
      />
    </Button>
  );
}
