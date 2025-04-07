'use client'
import { useRef, useState } from "react"
import { saveAs } from 'file-saver'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LuUndo2 } from "react-icons/lu"
import { Application } from "@pixi/react"
import AddChessButton from "./AddChessButton"
import FrisbeeButton from "./FrisbeeButton"
import Field from "./Field"
import BrushSelector from "./BrushSelector"
import useStroke from "@/hooks/useStroke"
import SelectState from "@/lib/select"
import { useTacticBoardStore } from '@/store/tactic-board'

export default function TacticBoard() {
  const {
    chesses,
    frisbees,
    strokes,
    brush,
    saveName,
    removeChess,
    removeFrisbee,
    setStrokes,
    setSaveName,
    importBoard
  } = useTacticBoardStore()
  
  const strokeHook = useStroke(brush)
  const selectState = useRef<SelectState>(new SelectState())
  const [isImporting, setIsImporting] = useState(false)
	

  const exportBoard = () => {
    const data = {
      chesses: Array.from(chesses.entries()),
      frisbees,
      strokes: strokeHook.lines,
      name: saveName || 'tactic-board-' + new Date().toISOString().slice(0, 10)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveAs(blob, `${data.name}.json`)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (imported.chesses || imported.frisbees || imported.strokes) {
          importBoard({
            chesses: imported.chesses || [],
            frisbees: imported.frisbees || [],
            strokes: imported.strokes || []
          })
        }
        if (imported.name) setSaveName(imported.name)
        if (imported.strokes) strokeHook.setLines(imported.strokes)
      } catch (error) {
        console.error('Error parsing tactic board file:', error)
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  const onDeletion = () => {
    const target = selectState.current.target
    if (!target) return
    const objectType = (target as any).objectType
    const objectId: number = (target as any).objectId
    
    switch (objectType) {
      case 'player': {
        const color = (target as any).color
        removeChess(color, objectId)
        break
      }
      case 'frisbee': {
        removeFrisbee(objectId)
        break
      }
      case 'stroke': {
        if (objectId == -1) {
          // Handle special case if needed
        } else {
          strokeHook.deleteLine(objectId)
        }
      }
    }
    selectState.current.unselect()
  }

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col items-center gap-4 mb-4 w-full">
				<div className="flex gap-4 items-center w-full max-w-4xl">
					<Input
						type="text"
						placeholder="Save name"
						value={saveName}
						onChange={(e) => setSaveName(e.target.value)}
						className="w-48"
					/>
					<Button 
						variant="outline" 
						onClick={exportBoard}
						disabled={chesses.size === 0 && frisbees.length === 0 && strokeHook.lines.length === 0 && strokeHook.curves.length === 0}
					>
						{isImporting ? 'Importing...' : 'Export Board'}
					</Button>
					<Button asChild variant="outline" disabled={isImporting}>
						<label>
							Import Board
							<input 
								type="file" 
								accept=".json" 
								onChange={importBoard}
								className="hidden"
								disabled={isImporting}
							/>
						</label>
					</Button>
				</div>
			</div>
			<Application
				antialias={true}
				width={1080}
				height={500}
				autoDensity={true}
				resolution={2}
				background="#ffffff"
			>
				<Field 
				       chesses={chesses} 
				       frisbees={frisbees} 
				       brush={brush} 
				       strokeHook={strokeHook} 
				       selectState={selectState} 
				     />
			</Application>
    		<div className="flex justify-between w-180 items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
			<AddChessButton />
			<FrisbeeButton />
			{/* <Toggle variant='outline' onPressedChange={(pressed: boolean) => drawModeRef.current = pressed ? 1 : 0}><Pen /></Toggle> */}
			<BrushSelector brush={brush} onBrushChange={setBrush}/>
			<DeleteButton onDeletion={onDeletion}/>
			</div>
		</div>
	)
}

const DeleteButton = ({ onDeletion }: { onDeletion?: () => void }) => (
  <Button variant="outline" onClick={onDeletion}>
    <LuUndo2 />
  </Button>
)
