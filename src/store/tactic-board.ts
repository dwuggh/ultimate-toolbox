import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChessColor, ChessData, ChessMap } from '@/app/tactic-board/components/Player'
import { FrisbeeData } from '@/app/tactic-board/components/Frisbee'
import { StrokeData } from '@/lib/strokes'
import { Brush } from '@/lib/brush'

interface TacticBoardState {
  chesses: ChessMap
  frisbees: FrisbeeData[]
  strokes: StrokeData[]
  brush: Brush
  saveName: string
  
  // Actions
  addChess: (chess: ChessData) => void
  removeChess: (color: ChessColor, id: number) => void 
  setChesses: (chesses: ChessMap) => void
  addFrisbee: (frisbee: FrisbeeData) => void
  removeFrisbee: (id: number) => void
  setFrisbees: (frisbees: FrisbeeData[]) => void
  addStroke: (stroke: StrokeData) => void 
  removeStroke: (id: number) => void
  setStrokes: (strokes: StrokeData[]) => void
  setBrush: (brush: Brush) => void
  setSaveName: (name: string) => void
  reset: () => void
  importBoard: (data: {
    chesses: [ChessColor, ChessData[]][]
    frisbees: FrisbeeData[]
    strokes: StrokeData[]
  }) => void
}

export const useTacticBoardStore = create<TacticBoardState>()(
  persist(
    (set) => ({
      chesses: new Map(),
      frisbees: [],
      strokes: [],
      brush: new Brush(),
      saveName: '',
      
      addChess: (chess) => set((state) => {
        const newChesses = new Map(state.chesses)
        const players = newChesses.get(chess.color) || []
        chess.id = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1
        newChesses.set(chess.color, [...players, chess])
        return { chesses: newChesses }
      }),
      
      removeChess: (color, id) => set((state) => {
        const newChesses = new Map(state.chesses)
        const players = newChesses.get(color) || []
        newChesses.set(color, players.filter(p => p.id !== id))
        return { chesses: newChesses }
      }),
      
      setChesses: (chesses) => set({ chesses }),
      
      addFrisbee: (frisbee) => set((state) => ({
        frisbees: [...state.frisbees, frisbee]
      })),
      
      removeFrisbee: (id) => set((state) => ({
        frisbees: state.frisbees.filter(f => f.id !== id)
      })),
      
      setFrisbees: (frisbees) => set({ frisbees }),
      
      addStroke: (stroke) => set((state) => ({
        strokes: [...state.strokes, stroke]
      })),
      
      removeStroke: (id) => set((state) => ({
        strokes: state.strokes.filter(s => s.id !== id)
      })),
      
      setStrokes: (strokes) => set({ strokes }),
      
      setBrush: (brush) => set({ brush }),
      
      setSaveName: (saveName) => set({ saveName }),
      
      reset: () => set({ 
        chesses: new Map(),
        frisbees: [],
        strokes: [],
        saveName: ''
      }),
      
      importBoard: (data) => set({
        chesses: new Map(data.chesses),
        frisbees: data.frisbees,
        strokes: data.strokes
      })
    }),
    {
      name: 'tactic-board-storage',
      partialize: (state) => ({ 
        chesses: Array.from(state.chesses.entries()),
        frisbees: state.frisbees,
        strokes: state.strokes,
        saveName: state.saveName
      })
    }
  )
)
