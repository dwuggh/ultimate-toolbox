'use client';
import { useRef, useEffect, useState, } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { VideoOverlay } from './VideoOverlay';
import type { Annotation } from './VideoOverlay';
import { Button } from '@/components/ui/button';
import { LuPencil, LuX } from "react-icons/lu";
import PlaybackControls from './PlaybackControls';
import { Brush, BrushType } from '@/lib/brush';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  playerRef: React.RefObject<any>;
  onTimeUpdate: (time: number) => void;
  annotations: Annotation[];
  currentTime: number;
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
}

export default function VideoPlayer({
  videoRef,
  playerRef,
  onTimeUpdate,
  annotations,
  currentTime,
  onAddAnnotation
}: VideoPlayerProps) {
  const [videoDimensions, setVideoDimensions] = useState({ width: 800, height: 450 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<any>(null);
	const [brush, setBrush] = useState<Brush>(new Brush());
  const [playbackRate, setPlaybackRate] = useState(1);

  const toggleDrawMode = () => {
    videoRef.current.pause();
    console.log(brush);
    setBrush((prev) => prev.changeType(prev.type === BrushType.PEN ? BrushType.POINTER : BrushType.PEN));
  };

  const handleSaveAnnotation = () => {
    if (overlayRef.current) {
      overlayRef.current.saveAnnotation();
      toggleDrawMode();
    }
  };

  const handleCancelAnnotation = () => {
    if (overlayRef.current) {
      overlayRef.current.cancelAnnotation();
      toggleDrawMode();
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
    }
  };

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, [])

  useEffect(() => {
    console.log("videoRef.current", videoRef.current, playerRef.current);
    if (!hasMounted || !videoRef.current) return;

    if (videoRef.current && !playerRef.current) {
      const player = playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2]
      });

      const updateDimensions = () => {
        if (containerRef.current) {
          setVideoDimensions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight
          });
        }
      };


      player.on('timeupdate', () => {
        onTimeUpdate(player.currentTime()!);
      });

      player.on('resize', updateDimensions);

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [hasMounted]);

  return (
    <Card>
      <CardContent className="p-0" ref={containerRef}>
        <div className="relative bg-black overflow-hidden" style={{ position: 'relative' }}>
          <div data-vjs-player>
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
          </div>
          <VideoOverlay
            width={videoDimensions.width}
            height={videoDimensions.height}
            videoRef={videoRef}
            brush={brush}
            annotations={annotations}
            currentTime={currentTime}
            onAddAnnotation={onAddAnnotation}
            ref={overlayRef}
          />
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <div className=''>
          <PlaybackControls playbackRate={playbackRate} onRateChange={handlePlaybackRateChange} />
        </div>
        <div className="flex gap-2">
          {brush.type === BrushType.PEN ? (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={handleSaveAnnotation}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelAnnotation}
              >
                <LuX className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={toggleDrawMode}
            >
              <LuPencil className="h-4 w-4 mr-2" />
              Add Drawing
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
