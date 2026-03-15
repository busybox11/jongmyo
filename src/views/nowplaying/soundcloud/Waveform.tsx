import { useCallback, useEffect, useRef } from 'react';

type SoundCloudWaveformComponentProps = {
  samples: number[];
  progress: number;
  getProgress: () => number;
  duration: number;
  isPlaying: boolean;
};

export default function SoundCloudWaveformComponent({
  samples,
  progress,
  getProgress,
  duration,
  isPlaying: _isPlaying,
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
          getProgress={getProgress}
          duration={duration}
        />
      </div>
    </div>
  );
}

function WaveformCanvas({
  samples,
  getProgress,
  duration,
}: {
  samples: number[];
  getProgress: () => number;
  duration: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const progress = getProgress();
    const dpr = window.devicePixelRatio ?? 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    const barWidth = 3;
    const barSpacing = 2;
    const totalBarWidth = barWidth + barSpacing;

    const firstBarHeight = h * 0.65;
    const secondBarHeight = h * 0.3;
    const secondBarHeightOffset = firstBarHeight + 2;

    const exactBarIndex = (progress / duration) * samples.length;
    const centerX = w / 2;

    let start = Math.floor(exactBarIndex - centerX / totalBarWidth);
    let end = Math.ceil(exactBarIndex + (w - centerX) / totalBarWidth);
    start = Math.max(0, start);
    end = Math.min(samples.length, end);

    // Lerp white -> orange; t in [0,1] is progress through this bar
    const lerpColor = (t: number, mainAlpha: boolean) => {
      const u = Math.max(0, Math.min(1, t));
      const r = Math.round(255 + u * (242 - 255));
      const g = Math.round(255 + u * (111 - 255));
      const b = Math.round(255 + u * (35 - 255));
      const a = mainAlpha ? 0.25 + u * 0.55 : 0.075 + u * 0.225;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    for (let i = start; i < end; i++) {
      const barProgress = exactBarIndex - i;
      const sample = samples[i];
      const height = (sample / 135) * firstBarHeight;
      const heightOffset = firstBarHeight - height;
      const secondBarHeightValue = (sample / 135) * secondBarHeight;

      // Position so playhead (exactBarIndex) stays at centerX; bars slide smoothly
      const xOffset = (i - exactBarIndex) * totalBarWidth + centerX;

      ctx.fillStyle = lerpColor(barProgress, true);
      ctx.fillRect(xOffset, heightOffset, barWidth, height);
      ctx.fillStyle = lerpColor(barProgress, false);
      ctx.fillRect(
        xOffset,
        secondBarHeightOffset,
        barWidth,
        secondBarHeightValue,
      );
    }
  }, [samples, duration, getProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio ?? 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const c = canvas.getContext('2d');
      c?.scale(dpr, dpr);
    });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx?.scale(dpr, dpr);
    resizeObserver.observe(canvas);

    let rafId: number;
    const loop = () => {
      drawWaveform();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [drawWaveform]);

  return (
    <canvas id="waveform-canvas" className="w-full h-full" ref={canvasRef} />
  );
}
