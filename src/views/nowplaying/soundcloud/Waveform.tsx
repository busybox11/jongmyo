import { useCallback, useEffect, useRef } from 'react';

type SoundCloudWaveformComponentProps = {
  samples: number[];
  progress: number;
  duration: number;
  isPlaying: boolean;
};

export default function SoundCloudWaveformComponent({
  samples,
  progress,
  duration,
  isPlaying,
}: SoundCloudWaveformComponentProps) {
  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-end h-full w-auto overflow-hidden -ml-6 -mr-6">
      <div className="absolute bottom-0 left-0 right-0 flex flex-row items-center justify-between px-6 mb-7">
        <span className="text-xs bg-black text-stone-200 px-1">
          {formatDuration(progress)}
        </span>
        <span className="text-xs bg-black text-stone-200 px-1">
          {formatDuration(duration)}
        </span>
      </div>

      <div id="waveform" className="w-full h-full">
        <WaveformCanvas
          samples={samples}
          progress={progress}
          duration={duration}
        />
      </div>
    </div>
  );
}

function WaveformCanvas({
  samples,
  progress,
  duration,
}: {
  samples: number[];
  progress: number;
  duration: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const baseColor = (alpha: number) => `rgba(242, 111, 35, ${alpha})`;

        const barWidth = 1;
        const firstBarHeight = canvas.height * 0.65;

        const secondBarHeight = canvas.height * 0.3;
        const secondBarHeightOffset = firstBarHeight + 2;

        const currentIndex = Math.floor((progress / duration) * samples.length);

        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];

          const height = (sample / 135) * firstBarHeight;
          const heightOffset = firstBarHeight - height;

          const secondBarHeightValue = (sample / 135) * secondBarHeight;

          ctx.fillStyle =
            i <= currentIndex ? baseColor(0.8) : `rgba(255, 255, 255, 0.3)`;
          ctx.fillRect(
            i * barWidth + barWidth * i,
            heightOffset,
            barWidth,
            height,
          );
          ctx.fillStyle =
            i <= currentIndex ? baseColor(0.3) : `rgba(255, 255, 255, 0.1)`;
          ctx.fillRect(
            i * barWidth + barWidth * i,
            secondBarHeightOffset,
            barWidth,
            secondBarHeightValue,
          );
        }
      }
    }
  }, [samples, progress, duration]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  return (
    <canvas
      id="waveform-canvas"
      className="w-full h-full"
      ref={canvasRef}
    ></canvas>
  );
}
