import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Player = {
  id: string;
  name: string;
  jerseyNumber: number;
  gender: 'male' | 'female' | 'other';
  position?: string;
  createdAt: string;
};

type PlayersStore = {
  players: Player[];
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  removePlayer: (id: string) => void;
  setPlayers: (players: Player[]) => void;
  clearPlayers: () => void;
};

export const usePlayersStore = create<PlayersStore>()(
  persist(
    (set) => ({
      players: [],
      addPlayer: (player) => set((state) => ({
        players: [
          ...state.players,
          {
            ...player,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          }
        ]
      })),
      removePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),
      setPlayers: (players) => set({ players }),
      clearPlayers: () => set({ players: [] })
    }),
    {
      name: 'players-storage',
    }
  )
);
