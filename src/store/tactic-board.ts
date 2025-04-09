import { create } from 'zustand'
import {produce} from 'immer'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Point, StrokeData } from '@/lib/strokes'
import { Brush } from '@/lib/brush'

export class FrisbeeData {
  id: number;

  constructor(id: number) {
    this.id = id;
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

  constructor(color: ChessColor, id: number) {
    this.color = color;
    this.id = id;
  }
}

export class Positioned<T> {
  position: Point = new Point(0, 0);
  object: T;
  constructor(object: T, position?: Point) {
    this.object = object;
    this.position = position || new Point(0, 0);
  }

  setPosition(newPos: Point) {
    return new Positioned(this.object, newPos);
  }
}

export type ChessMap = Map<ChessColor, Positioned<ChessData>[]>

interface TacticBoardState {
  chesses: ChessMap
  frisbees: Positioned<FrisbeeData>[]
  strokes: Positioned<StrokeData>[]
  brush: Brush
  saveName: string
  
  // Actions
  addChess: (chess: Positioned<ChessData>) => void
  removeChess: (color: ChessColor, id: number) => void 
  setChesses: (chesses: ChessMap) => void
  addFrisbee: (frisbee: Positioned<FrisbeeData>) => void
  removeFrisbee: (id: number) => void
  setFrisbees: (frisbees: Positioned<FrisbeeData>[]) => void
  addStroke: (stroke: Positioned<StrokeData>) => void 
  removeStroke: (id: number) => void
  setStrokes: (strokes: Positioned<StrokeData>[]) => void
  setBrush: (brush: Brush) => void
  setSaveName: (name: string) => void
  reset: () => void
  updatePosition: (objectType: string, id: number, newPos: Point, color?: ChessColor) => void
  importBoard: (data: {
    chesses: [ChessColor, Positioned<ChessData>[]][]
    frisbees: Positioned<FrisbeeData>[]
    strokes: Positioned<StrokeData>[]
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
        const players = newChesses.get(chess.object.color) || []
        chess.object.id = players.length > 0 ? Math.max(...players.map(p => p.object.id)) + 1 : 1
        newChesses.set(chess.object.color, [...players, chess])
        return { chesses: newChesses }
      }),
      
      removeChess: (color, id) => set((state) => {
        const newChesses = new Map(state.chesses)
        const players = newChesses.get(color) || []
        newChesses.set(color, players.filter(p => p.object.id !== id))
        return { chesses: newChesses }
      }),
      
      setChesses: (chesses) => set({ chesses }),
      
      addFrisbee: (frisbee) => set((state) => ({
        frisbees: [...state.frisbees, frisbee]
      })),
      
      removeFrisbee: (id) => set((state) => ({
        frisbees: state.frisbees.filter(f => f.object.id !== id)
      })),
      
      setFrisbees: (frisbees) => set({ frisbees }),
      
      addStroke: (stroke) => set((state) => ({
        strokes: [...state.strokes, stroke]
      })),
      
      removeStroke: (id) => set((state) => ({
        // TODO
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

      updatePosition: (objectType: string, id: number, newPos: Point, color?: ChessColor) => {
        switch (objectType) {
          case 'player': {
            set((state) => {
              const newChesses = new Map(state.chesses)
              const players = newChesses.get(color!) || []
              const newPlayers = players.map(p => p.object.id === id ? p.setPosition(newPos) : p)
              newChesses.set(color!, newPlayers)
              return { chesses: newChesses }
            })
            break
          }
          case 'frisbee': {
            return set(
              (state) => {
                console.log(state.frisbees)
                const newFrisbees = state.frisbees.map(f => f.object.id === id ? new Positioned(f.object, newPos) : f)
                return { frisbees: newFrisbees }
              }

              )
            break
          }
          case 'stroke': {
            set((state) => ({
              
            }))}
        }
      },
      
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
      },
      skipHydration: true
    }
  )
)
