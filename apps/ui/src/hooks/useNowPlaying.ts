import { atom, useAtomValue } from "jotai";

export const nowPlayingAtom = atom<{
  meta: {
    source: string;
    url: string;
    image: string;
  };
  progress: {
    playing: boolean;
    current: number;
    duration: number;
  };
  title: string;
  artist: string;
  album: string;
}>({
  meta: {
    source: "Spotify",
    url: "https://open.spotify.com/track/1Mn7726PLnvPOUlYvrlLxS",
    image: "https://i.scdn.co/image/ab67616d00001e026c1bab854ba30713113c297a",
  },
  progress: { playing: true, current: 147822, duration: 178177 },
  title: "The Pearl",
  artist: "Cecile Believe",
  album: "Tender the Spark",
});

export const useNowPlaying = () => {
  const nowPlaying = useAtomValue(nowPlayingAtom);
  return nowPlaying;
};
