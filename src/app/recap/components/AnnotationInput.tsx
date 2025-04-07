'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { usePlayersStore } from '@/store/players';

interface AnnotationInputProps {
  currentTime: number;
  annotationText: string;
  onTextChange: (text: string) => void;
  onAdd: (tags: string[]) => void;
}

export default function AnnotationInput({ 
  currentTime, 
  annotationText, 
  onTextChange, 
  onAdd 
}: AnnotationInputProps) {
  const { players } = usePlayersStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const handleAddTag = (playerId: string) => {
    if (!selectedTags.includes(playerId)) {
      setSelectedTags([...selectedTags, playerId]);
    }
    setShowTagSelector(false);
  };

  const handleRemoveTag = (playerId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== playerId));
  };

  const handleSubmit = () => {
    onAdd(selectedTags);
    setSelectedTags([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Annotation at {currentTime.toFixed(1)}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            value={annotationText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter your note..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            disabled={!annotationText.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTags.map(playerId => {
            const player = players.find(p => p.id === playerId);
            if (!player) return null;
            return (
              <Badge 
                key={playerId} 
                variant="outline"
                className="flex items-center gap-1"
              >
                #{player.jerseyNumber} {player.name}
                <button 
                  onClick={() => handleRemoveTag(playerId)}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagSelector(!showTagSelector)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Player Tag
          </Button>
        </div>

        {showTagSelector && (
          <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
            {players.length === 0 ? (
              <p className="text-sm text-muted-foreground">No players available</p>
            ) : (
              players.map(player => (
                <div 
                  key={player.id}
                  className="flex items-center justify-between p-1 hover:bg-muted rounded cursor-pointer"
                  onClick={() => handleAddTag(player.id)}
                >
                  <span className="text-sm">
                    #{player.jerseyNumber} {player.name}
                  </span>
                  {selectedTags.includes(player.id) && (
                    <span className="text-xs text-muted-foreground">Added</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
