import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Point, StrokeData } from '@/lib/strokes'
import { Brush } from '@/lib/brush'

export class FrisbeeData {
  id: number;
  initialPosition: Point = new Point(0, 0);

  constructor(id: number, initialPosition?: Point) {
    this.id = id;
    this.initialPosition = initialPosition || new Point(0, 0);
  }
}

export enum ChessColor {
  RED = 0xFF0000,
  GREEN = 0x00FF00,
  BLUE = 0x0000FF,
  YELLOW = 0xFFFF00,
  PURPLE = 0xFF00FF,
  CYAN = 0x00FFFF
}
export class ChessData {
  color: ChessColor;
  id: number;
  initialPosition: Point = new Point(0, 0);

  constructor(color: ChessColor, id: number, initialPosition?: Point) {
    this.color = color;
    this.id = id;
	this.initialPosition = initialPosition || new Point(0, 0);
  }
}

export type ChessMap = Map<ChessColor, ChessData[]>

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
        // TODO
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
        chesses: state.chesses,
        frisbees: state.frisbees,
        strokes: state.strokes,
        saveName: state.saveName
      }),
      storage: {
        getItem: (key) => {
          const str = localStorage.getItem(key) || '';
          return {
            state: {
              ...JSON.parse(str).state,
              chesses: new Map(JSON.parse(str).state.chesses)
            }
          }
        },
        setItem: (key, value) => {
          console.log("setItem", key, value);
          const str = JSON.stringify({
            state: {
              ...value.state,
              chesses: Array.from(value.state.chesses.entries()),
            },
          })
          localStorage.setItem(key, str)
        },
        removeItem: (key) => localStorage.removeItem(key)
      }
    }
  )
)
