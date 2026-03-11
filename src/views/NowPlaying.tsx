import { useNowPlaying } from '../hooks/useNowPlaying';

function formatDuration(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function NowPlaying() {
  const nowPlaying = useNowPlaying();

  return (
    <section className="w-full h-full p-6 flex flex-col relative">
      <div className="absolute inset-0 z-0 rounded-2xl">
        <svg id="img_bg_filters" className="absolute inset-0">
          <title>image filters</title>

          <filter id="blurFilter" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur stdDeviation="64" result="blurred" />
            <feColorMatrix
              type="saturate"
              values="2"
              in="blurred"
              result="saturate"
            />
            <feComponentTransfer in="saturate" result="glass">
              <feFuncR type="linear" slope="1.14" />
              <feFuncG type="linear" slope="1.14" />
              <feFuncB type="linear" slope="1.15" />
            </feComponentTransfer>
          </filter>

          <filter id="noiseFilter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.25"
              numOctaves="4"
              seed="15"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="grayscaleNoise"
            />
            <feDistantLight azimuth="3" elevation="145" />
            <feComponentTransfer in="grayscaleNoise" result="adjustedNoise">
              <feFuncA type="discrete" tableValues="0 .75 0 .75 0 .75 0 .75" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="adjustedNoise" mode="color-burn" />
          </filter>
        </svg>

        <img
          src={nowPlaying.meta.image}
          alt={nowPlaying.title}
          style={{ filter: 'url(#blurFilter) url(#noiseFilter)' }}
          className="w-full h-full object-cover rounded-2xl scale-125 opacity-20"
        />
      </div>

      <div className="flex space-x-6 z-10">
        <div className="w-[300px] h-[300px] bg-stone-900 shadow-3xl rounded-2xl relative shadow-2xl ring-2 ring-black/20">
          <div className="absolute inset-0 ring-inset ring ring-white/5 rounded-2xl"></div>
          <img
            src={nowPlaying.meta.image}
            alt={nowPlaying.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl text-stone-100/90 font-black">
            {nowPlaying.title}
          </h2>
          <h5 className="text-xl text-stone-400/90 font-medium -mt-1">
            {nowPlaying.artist}
          </h5>
          <h6 className="text-stone-400/50 mt-2">{nowPlaying.album}</h6>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-auto z-10">
        <div className="flex items-center justify-between space-x-2">
          <span className="text-sm tabular-nums text-stone-200/50">
            {formatDuration(nowPlaying.progress.current)}
          </span>
          <span className="text-sm tabular-nums text-stone-200/50">
            {formatDuration(nowPlaying.progress.duration)}
          </span>
        </div>

        <div className="h-2 w-full bg-white/10 rounded-full backdrop-blur-lg ring ring-black/20 overflow-hidden">
          <div
            className="h-full bg-white/50 rounded-full ring ring-black/50"
            style={{
              width: `${(nowPlaying.progress.current / nowPlaying.progress.duration) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
