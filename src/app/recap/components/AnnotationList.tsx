'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Annotation } from './VideoOverlay';
import { Badge } from '@/components/ui/badge';
import { Player, usePlayersStore } from '@/store/players';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AnnotationListProps {
  annotations: Annotation[];
  selectedVideo: string;
  onJumpTo: (annotation: Annotation) => void;
  onDelete: (id: string) => void;
}

export default function AnnotationList({ 
  annotations, 
  selectedVideo, 
  onJumpTo, 
  onDelete 
}: AnnotationListProps) {
  const { players } = usePlayersStore();
  const [filteredText, setFilteredText] = useState<string>('');

  const currentVideoAnnotations = annotations
    .filter(annotation => annotation.videoUrl === selectedVideo)
    .filter(annotation => {
      if (!filteredText) return true;

      // Check if annotation text matches
      const textMatch = annotation.text.toLowerCase().includes(filteredText.toLowerCase());

      // Check if any player tags match
      const tagMatch = annotation.tags?.some(tagId => {
        const player = players.find(p => p.id === tagId);
        return player?.name.toLowerCase().includes(filteredText.toLowerCase()) ||
          player?.jerseyNumber.toString().includes(filteredText);
      });

      return textMatch || tagMatch;
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredText(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annotations ({currentVideoAnnotations.length})</CardTitle>
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Filter..." value={filteredText} onChange={handleChange} />
        </div>
      </CardHeader>
      <CardContent>
        {selectedVideo ? (
          <ScrollArea className="h-[300px]">
            {currentVideoAnnotations.length > 0 ? (
              <div className="space-y-3">
                {currentVideoAnnotations.map((annotation) => (
                  <AnnotationItem
                    key={annotation.id}
                    annotation={annotation}
                    players={players}
                    onJumpTo={onJumpTo}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No annotations yet for this video</p>
            )}
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">Select a video to view annotations</p>
        )}
      </CardContent>
    </Card>
  );
}

interface AnnotationItemProps {
  annotation: Annotation;
  onJumpTo: (annotation: Annotation) => void;
  onDelete: (id: string) => void;
  players: Player[];
}

const AnnotationItem = ({ annotation, onJumpTo, onDelete, players }: AnnotationItemProps) => {
  return (
    <div
      key={annotation.id}
      className="p-3 border rounded-lg hover:bg-accent"
    >
      <div className="flex justify-between items-start">
        <Button
          onClick={() => onJumpTo(annotation)}
          variant="link"
          className="text-left h-auto p-0"
        >
          <div>
            <span className="font-medium">
              {annotation.time.toFixed(1)}s
            </span>
            {annotation.tags && annotation.tags.map((tag) => (
              <Badge key={tag} className="ml-1">{players.find(player => player.id === tag)?.name}</Badge>
            ))}
            <p className="text-muted-foreground mt-1">{annotation.text}</p>
          </div>
        </Button>
        <Button
          onClick={() => onDelete(annotation.id)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {new Date(annotation.createdAt).toLocaleString()}
      </div>
    </div>
  );
}