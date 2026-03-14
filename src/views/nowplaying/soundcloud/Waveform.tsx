import { useLayoutEffect } from 'react';

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

  const currentSampleIndex = Math.floor((progress / duration) * samples.length);
  useLayoutEffect(() => {
    const waveform = document.getElementById('waveform');
    if (waveform) {
      // scroll waveform container to make the current sample
      // visible in the center of the container
      const sampleElement = document.querySelector(
        `[data-index="${currentSampleIndex}"]`,
      );
      if (sampleElement) {
        const sampleRect = sampleElement.getBoundingClientRect();
        const containerRect = waveform.getBoundingClientRect();
        const scrollLeft =
          sampleRect.left -
          containerRect.left -
          containerRect.width / 2 +
          sampleRect.width / 2;
        waveform.scrollTo({
          left: scrollLeft,
        });
      }
    }
  }, [currentSampleIndex]);

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

      <div
        id="waveform"
        className="flex flex-row w-full overflow-x-auto overflow-y-hidden items-center space-x-[3px]"
      >
        {samples.map((sample, index) => (
          <div
            key={index.toString()}
            data-index={index}
            className="grid grid-rows-3 h-[128px] w-[2px] shrink-0"
          >
            <div className="row-span-2 grid items-end">
              <div
                className={
                  index <= currentSampleIndex
                    ? 'bg-orange-600'
                    : 'bg-stone-200/20'
                }
                style={{
                  height: `${(100 * sample) / 135}%`,
                }}
              />
            </div>
            <div className="row-span-1">
              <div
                className={
                  index <= currentSampleIndex
                    ? 'bg-orange-400/50'
                    : 'bg-stone-200/10'
                }
                style={{
                  height: `${(100 * sample) / 135}%`,
                  marginTop: '2px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
