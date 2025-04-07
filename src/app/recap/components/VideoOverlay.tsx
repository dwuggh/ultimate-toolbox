'use client';
import { Application, extend, useApplication } from '@pixi/react';
import { Point, Graphics, Text } from 'pixi.js';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import useStroke, { drawStroke } from '@/hooks/useStroke';
import { StrokeData } from '@/lib/strokes';
import { initDevtools } from '@pixi/devtools';
import { Brush, BrushType } from '@/lib/brush';

extend({Graphics, Text});

export interface Annotation {
  id: string;
  time: number;
  text: string;
  tags: string[];
  videoUrl: string;
  createdAt: string;
  drawing?: Array<StrokeData>; // normalized points
}

interface VideoOverlayProps {
  width: number;
  height: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  brush: Brush,
  annotations: Annotation[];
  currentTime: number;
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  ref: React.RefObject<any>;
}

export function VideoOverlay({
  width,
  height,
  videoRef,
  brush,
  annotations,
  currentTime,
  onAddAnnotation,
  ref,
}: VideoOverlayProps) {
  const appRef = useRef<any>(null);

  const getVideoCoordinates = (clientX: number, clientY: number): Point => {
    if (!videoRef.current) return new Point(0, 0);
    const rect = videoRef.current.getBoundingClientRect();
    return new Point(
      ((clientX - rect.left) / rect.width) * width,
      ((clientY - rect.top) / rect.height) * height
    );
  };

  const strokeHook = useStroke(brush);

  const handlePointerDown = (e: any) => {
    const pos = getVideoCoordinates(e.clientX, e.clientY);
    strokeHook.onPointerDown(pos);
  };

  const handlePointerMove = (e: any) => {
    const pos = getVideoCoordinates(e.clientX, e.clientY);
    strokeHook.onPointerMove(pos);
  };

  const handlePointerUp = (e: any) => {
    strokeHook.onPointerUp();
  };

  useImperativeHandle(ref, () => ({
    saveAnnotation: () => {
      console.log("save annotation", strokeHook.lines);
      const annotation = {
        time: currentTime,
        text: '',
        x: 0,
        y: 0,
        videoUrl: '',
        tags: [],
        drawing: [...strokeHook.lines]
      }
        const text = 'stroke';
        onAddAnnotation({
          ...annotation,
          text,
        });
      strokeHook.clear();
    },
    cancelAnnotation: () => {
      
      strokeHook.clear();
    }
  }))

  return (
    <div className="absolute inset-0"
      style={{ pointerEvents: brush.type == BrushType.POINTER ? 'none' : 'auto', zIndex: 1 }}
    >

      <div
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      style={{ pointerEvents: brush.type == BrushType.POINTER ? 'none' : 'auto', zIndex: 1 }}
      >
        <Application
          ref={appRef}
          width={width}
          height={height}
          antialias={true}
          backgroundAlpha={0}
        >
          {annotations
            .filter(a => Math.abs(a.time - currentTime) < 0.5)
            .map((annotation) => (
              <AnnotationMarker
                key={annotation.id}
                annotation={annotation}
                width={width}
                height={height}
                currentTime={currentTime}
              />
          ))}
          {strokeHook.lines.map((line, i) => (
            <pixiGraphics
              key={i}
              draw={g => {
                drawStroke(g, line);
              }}
            />
          ))}

          {strokeHook.currentLine && (
            <pixiGraphics
              draw={g => {
                if (!strokeHook.currentLine) return;
                drawStroke(g, strokeHook.currentLine);
              }}
            />
          )}
        </Application>
      </div>
    </div>
  );
}

function AnnotationMarker({
  annotation = { drawing: [] },
  width,
  height,
  currentTime
}: {
  annotation?: Partial<Annotation>;
  width: number;
  height: number;
  currentTime: number;
}) {
  // console.log(annotation.drawing ? true : false);
  const app = useApplication();
  initDevtools(app);
  (globalThis as any).__PIXI_APP__ = app.app;

  return (
    <>
      {annotation.drawing?.map((line) => (
        <pixiGraphics
          draw={g => {
            drawStroke(g, line);
          }}
        />
      ))}

      <pixiText
        text={annotation.text}
        style={{
          fill: '#ffffff',
          fontSize: 14,
          fontFamily: 'Arial',
          dropShadow: true,
        }}
      />
    </>
  );
}
