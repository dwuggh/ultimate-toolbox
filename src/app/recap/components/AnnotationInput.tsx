'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AnnotationInputProps {
  currentTime: number;
  annotationText: string;
  onTextChange: (text: string) => void;
  onAdd: () => void;
}

export default function AnnotationInput({ 
  currentTime, 
  annotationText, 
  onTextChange, 
  onAdd 
}: AnnotationInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Annotation at {currentTime.toFixed(1)}s</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            value={annotationText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter your note..."
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          />
          <Button
            onClick={onAdd}
            disabled={!annotationText.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
