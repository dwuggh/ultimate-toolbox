'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from "@/components/ui/slider";

interface PlaybackControlsProps {
  playbackRate: number;
  onRateChange: (rate: number) => void;
}

export default function PlaybackControls({ playbackRate, onRateChange }: PlaybackControlsProps) {
  return (
        <div className="flex flex-wrap items-center m-8">
          {[0.1, 0.2, 0.3, 0.5, 1, 1.5, 2, 3].map(rate => (
            <div className='flex gap-2' key={rate}>
            <Button
              onClick={() => onRateChange(rate)}
              variant={playbackRate === rate ? 'outline' : 'ghost'}
              size="sm"
              className='w-12'
            >
              {rate}x
            </Button>
            </div>
          ))}
          <div className="flex items-center gap-2 w-full mt-3">
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={[playbackRate]}
              onValueChange={(val) => onRateChange(val[0])}
            />
            <span className="text-sm font-medium w-12 text-center">
              {playbackRate.toFixed(1)}x
            </span>
          </div>
        </div>
  );
}
