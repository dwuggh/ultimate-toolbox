'use client';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type Player = {
  id: string;
  name: string;
  jerseyNumber: number;
  gender: 'male' | 'female' | 'other';
  position?: string;
  createdAt: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'createdAt'>>({
    name: '',
    jerseyNumber: 0,
    gender: 'male',
    position: ''
  });

  // Load players from localStorage on mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      try {
        setPlayers(JSON.parse(savedPlayers));
      } catch (error) {
        console.error('Failed to parse players from localStorage', error);
      }
    }
  }, []);

  const savePlayers = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  const addPlayer = () => {
    if (!newPlayer.name.trim()) return;

    const player: Player = {
      ...newPlayer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    savePlayers([...players, player]);
    setNewPlayer({
      name: '',
      jerseyNumber: 0,
      gender: 'male',
      position: ''
    });
  };

  const removePlayer = (id: string) => {
    savePlayers(players.filter(p => p.id !== id));
  };

  const exportPlayers = () => {
    const data = JSON.stringify(players, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    saveAs(blob, `players-${new Date().toISOString().slice(0,10)}.json`);
  };

  const importPlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          savePlayers(imported);
        }
      } catch (error) {
        console.error('Error parsing players file:', error);
        alert('Invalid players file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Player Management</h1>

        {/* Import/Export Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            onClick={exportPlayers}
            disabled={players.length === 0}
            className="flex-1 sm:flex-none"
          >
            Export Players
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <label className="cursor-pointer">
              Import Players
              <input
                type="file"
                accept=".json"
                onChange={importPlayers}
                className="hidden"
              />
            </label>
          </Button>
        </div>

        {/* Add Player Form */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Full Name"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Jersey Number"
              value={newPlayer.jerseyNumber || ''}
              onChange={(e) => setNewPlayer({
                ...newPlayer,
                jerseyNumber: Math.max(0, parseInt(e.target.value) || 0)
              })}
              min="0"
            />
            <Select
              value={newPlayer.gender}
              onValueChange={(value) => setNewPlayer({
                ...newPlayer,
                gender: value as 'male' | 'female' | 'other'
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Position (optional)"
              value={newPlayer.position || ''}
              onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
            />
          </div>
          <Button
            className="mt-4 w-full sm:w-auto"
            onClick={addPlayer}
            disabled={!newPlayer.name.trim()}
          >
            Add Player
          </Button>
        </div>

        {/* Player Roster */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Player Roster</h2>
            <span className="text-muted-foreground text-sm">
              {players.length} player{players.length !== 1 ? 's' : ''}
            </span>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No players have been added yet
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span className="inline-flex items-center justify-center size-6 bg-muted rounded-full text-xs font-mono">
                        #{player.jerseyNumber}
                      </span>
                      {player.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {player.gender.charAt(0).toUpperCase() + player.gender.slice(1)}
                      {player.position && ` • ${player.position}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlayer(player.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}