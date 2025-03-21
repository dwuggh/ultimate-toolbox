'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VideoLibraryProps {
  videos: { name: string; url: string }[];
  selectedVideo: string;
  onSelect: (url: string) => void;
  onDirectoryChange: () => void;
}

export default function VideoLibrary({ 
  videos, 
  selectedVideo, 
  onSelect, 
  onDirectoryChange 
}: VideoLibraryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Video Library</CardTitle>
        <Button
          onClick={onDirectoryChange}
          variant="outline"
          size="sm"
          title="Select video directory"
        >
          Change Folder
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {videos.map((video) => (
              <Button
                key={video.url}
                onClick={() => onSelect(video.url)}
                variant={selectedVideo === video.url ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                {video.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
