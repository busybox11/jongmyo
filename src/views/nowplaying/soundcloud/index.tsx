import { MonitorSpeakerIcon, PauseIcon, Volume1Icon } from 'lucide-react';
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
          className="w-full h-full object-cover rounded-2xl scale-125 opacity-15 blur-3xl"
        />
      </div>

      <div className="absolute inset-0 flex flex-col z-10 px-6 w-full h-full">
        <div className="h-36 flex flex-row space-x-5 mt-6 mb-8 shrink-0 w-full">
          <div className="relative size-36 shrink-0">
            <div className="absolute inset-0 rounded-lg ring-[1.5px] ring-white/15 ring-inset"></div>

            <div
              className="absolute bottom-3 right-3 size-12 rounded-full bg-stone-950/50 border-2 border-stone-950/80 flex items-center justify-center backdrop-blur transition-opacity duration-200 data-[playing=false]:opacity-100 data-[playing=true]:opacity-0"
              data-playing={nowPlaying.playing}
            >
              <PauseIcon className="size-6 text-stone-200 fill-stone-200/25" />
            </div>

            <img
              src={nowPlaying.image}
              alt={nowPlaying.title}
              className="size-full object-cover rounded-lg shrink-0 ring-2 ring-black/15"
            />
          </div>

          <div className="flex flex-col h-full w-full overflow-hidden">
            <h1 className="text-2xl font-bold break-words bg-black text-stone-300 leading-6 px-2 py-1.5 mr-auto">
              {nowPlaying.title}
            </h1>
            <div className="flex -mt-1 mr-8">
              <p className="text-sm break-words bg-black text-stone-500 leading-4 px-2 py-1 mr-auto">
                {nowPlaying.artist}
              </p>
            </div>

            <div className="flex flex-row flex-wrap mt-auto w-auto">
              {nowPlaying.genre.map((genre) => (
                <span
                  key={genre}
                  className="text-xs bg-stone-950 text-stone-200 px-1.5 py-0.5 rounded-full mr-2 mt-1"
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
          isPlaying={nowPlaying.playing}
        />

        <div className="flex flex-row items-center text-xs pb-3 pt-2 px-0.5 shrink-0 w-full text-stone-200/40">
          <MonitorSpeakerIcon className="size-4 mr-2" />
          <span>realbox</span>

          <Volume1Icon className="size-4 ml-auto mr-2" />
          <span>87%</span>
        </div>
      </div>
    </main>
  );
}
