'use client';
import { useState, useEffect, useRef, RefObject } from 'react';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import VideoPlayer from './components/VideoPlayer';
import PlaybackControls from './components/PlaybackControls';
import AnnotationInput from './components/AnnotationInput';
import VideoLibrary from './components/VideoLibrary';
import AnnotationList from './components/AnnotationList';
import { Annotation } from './components/VideoOverlay';
import { TacticBoardDrawer } from './components/TacticBoardDrawer';

interface VideoFile {
  name: string;
  url: string;
}

export default function VideoRecap() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [annotationText, setAnnotationText] = useState<string>('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedDirectory, setSelectedDirectory] = useState<string>('videos');

  const handleDirectorySelect = async () => {
    try {
      const dirPath = prompt('Enter directory path (relative to public folder):', 'videos');
      if (!dirPath) return;
      
      setSelectedDirectory(dirPath);
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ directoryPath: dirPath })
      });
      
      if (!response.ok) throw new Error('Failed to load videos');
      const videos = await response.json();
      setVideos(videos);
    } catch (error) {
      console.error('Error selecting directory:', error);
      const response = await fetch('/api/videos');
      const videos = await response.json();
      setVideos(videos);
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ directoryPath: selectedDirectory })
        });
        if (!response.ok) throw new Error('Failed to fetch videos');
        setVideos(await response.json());
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      }
    };

    loadVideos();

    const savedAnnotations = localStorage.getItem('videoAnnotations');
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations));
    }
  }, [selectedDirectory]);

  const handleVideoChange = (url: string) => {
    setSelectedVideo(url);
    if (playerRef.current) {
      playerRef.current.src({ type: 'video/mp4', src: url });
      playerRef.current.play();
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
    }
  };

  const addAnnotation = (tags: string[]) => {
    if (!annotationText.trim() || !selectedVideo) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      time: currentTime,
      text: annotationText,
      tags,
      videoUrl: selectedVideo,
      createdAt: new Date().toISOString()
    };

    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    localStorage.setItem('videoAnnotations', JSON.stringify(updatedAnnotations));
    setAnnotationText('');
  };

  const jumpToAnnotation = (annotation: Annotation) => {
    if (playerRef.current) {
      playerRef.current.currentTime(annotation.time);
      playerRef.current.play();
    }
  };

  const deleteAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(a => a.id !== id);
    setAnnotations(updatedAnnotations);
    localStorage.setItem('videoAnnotations', JSON.stringify(updatedAnnotations));
  };

  const exportAnnotations = () => {
    const data = JSON.stringify(annotations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    saveAs(blob, 'annotations.json');
  };

  const importAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setAnnotations(imported);
          localStorage.setItem('videoAnnotations', JSON.stringify(imported));
        }
      } catch (error) {
        console.error('Error parsing annotations file:', error);
      }
    };
    reader.readAsText(file);
  };

	return (
		<div className="min-h-screen bg-muted/40 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-foreground mb-8">Video Recap Tool</h1>
				<div className="flex gap-4 mb-6">
					<Button 
						variant="outline" 
						onClick={exportAnnotations}
						disabled={annotations.length === 0}
					>
						Export Annotations
					</Button>
					<Button asChild variant="outline">
						<label>
							Import Annotations
							<input 
								type="file" 
								accept=".json" 
								onChange={importAnnotations}
								className="hidden"
							/>
						</label>
					</Button>
          <TacticBoardDrawer />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<VideoPlayer
							videoRef={videoRef as RefObject<HTMLVideoElement>}
							playerRef={playerRef}
							onTimeUpdate={setCurrentTime}
							annotations={annotations}
							currentTime={currentTime}
							onAddAnnotation={(annotation) => {
								const newAnnotation = {
									...annotation,
									id: Date.now().toString(),
									videoUrl: selectedVideo,
									createdAt: new Date().toISOString()
								};
								const updated = [...annotations, newAnnotation];
								setAnnotations(updated);
								localStorage.setItem('videoAnnotations', JSON.stringify(updated));
							}}
						/>
						<AnnotationInput
							currentTime={currentTime}
							annotationText={annotationText}
							onTextChange={setAnnotationText}
							onAdd={addAnnotation}
						/>
					</div>

					<div className="space-y-6">
						<VideoLibrary
							videos={videos}
							selectedVideo={selectedVideo}
							onSelect={handleVideoChange}
							onDirectoryChange={handleDirectorySelect}
						/>
						<AnnotationList
							annotations={annotations}
							selectedVideo={selectedVideo}
							onJumpTo={jumpToAnnotation}
							onDelete={deleteAnnotation}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
