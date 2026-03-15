import { MonitorSpeakerIcon, Volume1Icon } from 'lucide-react';
import { useSoundcloudNowPlaying } from '../../../hooks/useSoundcloudNowPlaying';
import SoundCloudWaveformComponent from './Waveform';

export default function SoundCloudNowPlaying() {
  const nowPlaying = useSoundcloudNowPlaying();

  return (
    <main className="w-full h-full relative">
      <div className="absolute inset-0 z-0 rounded-2xl pointer-events-none">
        <img
          src={nowPlaying.image}
          alt={nowPlaying.title}
          className="w-full h-full object-cover rounded-2xl scale-125 opacity-20 blur-xl"
        />
      </div>

      <div className="flex flex-col z-10 px-6 w-full h-full">
        <div className="h-36 flex flex-row space-x-4 shrink-0 mt-6 mb-6">
          <img
            src={nowPlaying.image}
            alt={nowPlaying.title}
            className="size-36 object-cover rounded-lg shrink-0"
          />

          <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold bg-black text-white mr-auto px-2">
              {nowPlaying.title}
            </h1>
            <p className="text-sm bg-black text-white/50 mr-auto px-2">
              {nowPlaying.artist}
            </p>

            <div className="flex flex-row flex-wrap mt-auto w-auto">
              {nowPlaying.genre.map((genre) => (
                <span
                  key={genre}
                  className="text-xs bg-stone-900 text-stone-200 px-1.5 py-0.5 rounded-full mr-2 mt-1 ring ring-stone-800 ring-inset"
                >
                  #{genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SoundCloudWaveformComponent
          samples={nowPlaying.waveform}
          progress={nowPlaying.progress}
          getProgress={nowPlaying.getProgress}
          duration={nowPlaying.duration}
          isPlaying={true}
        />

        <div className="flex flex-row items-center text-xs pb-3 pt-1 shrink-0 w-full text-stone-200/50">
          <MonitorSpeakerIcon className="size-4 mr-2 text-stone-200/50" />
          <span>realbox</span>

          <Volume1Icon className="size-4 ml-auto mr-2 text-stone-200/50" />
          <span>87%</span>
        </div>
      </div>
    </main>
  );
}
