'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface Annotation {
  id: string;
  time: number;
  text: string;
  videoUrl: string;
  createdAt: string;
}

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
  const currentVideoAnnotations = annotations.filter(
    annotation => annotation.videoUrl === selectedVideo
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annotations ({currentVideoAnnotations.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedVideo ? (
          <ScrollArea className="h-[300px]">
            {currentVideoAnnotations.length > 0 ? (
              <div className="space-y-3">
                {currentVideoAnnotations.map((annotation) => (
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
