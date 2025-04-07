'use client';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Player, usePlayersStore } from '@/store/players';

export default function PlayersPage() {
  const { players, addPlayer, removePlayer, setPlayers } = usePlayersStore();
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id' | 'createdAt'>>({
    name: '',
    jerseyNumber: 0,
    gender: 'male',
    position: ''
  });

  const handleAddPlayer = () => {
    if (!newPlayer.name.trim()) return;
    addPlayer(newPlayer);
    setNewPlayer({ 
      name: '',
      jerseyNumber: 0,
      gender: 'male',
      position: ''
    });
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
          setPlayers(imported);
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Player Management</CardTitle>
            <CardDescription>
              Manage your team roster and player information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Player</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleAddPlayer}
              disabled={!newPlayer.name.trim()}
            >
              Add Player
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Player Roster</CardTitle>
              <CardDescription>
                {players.length} player{players.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No players have been added yet
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((player) => (
                  <Card key={player.id} className="hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between p-4">
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
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
