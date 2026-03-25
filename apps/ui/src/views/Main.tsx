import {
  BluetoothIcon,
  DiscAlbumIcon,
  HomeIcon,
  LibraryIcon,
  ListMusicIcon,
  Mic2Icon,
  Music4Icon,
  UsbIcon,
} from "lucide-react";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { useRouter } from "../hooks/useRouter";

import MainAlbums from "./routes/MainAlbums";
import MainArtists from "./routes/MainArtists";
import MainHome from "./routes/MainHome";
import MainLibrary from "./routes/MainLibrary";
import MainPlaylists from "./routes/MainPlaylists";

const sidebarItems = [
  {
    icon: HomeIcon,
    label: "Jongmyo",
    href: "/",
    view: MainHome,
  },
  {
    icon: Music4Icon,
    label: "Now playing",
    href: "/nowplaying",
  },
  {
    icon: LibraryIcon,
    label: "Library",
    href: "/library",
    view: MainLibrary,
  },
  {
    icon: ListMusicIcon,
    label: "Playlists",
    href: "/playlists",
    view: MainPlaylists,
  },
  {
    icon: Mic2Icon,
    label: "Artists",
    href: "/artists",
    view: MainArtists,
  },
  {
    icon: DiscAlbumIcon,
    label: "Albums",
    href: "/albums",
    view: MainAlbums,
  },
];

function Sidebar() {
  const { path } = useRouter();

  return (
    <aside className="w-20 h-full">
      <nav className="h-full overflow-y-auto">
        <ul className="flex flex-col items-center justify-center space-y-2 p-2">
          {sidebarItems.map((item) =>
            item.href === "/nowplaying" ? (
              <NowPlayingNavIcon key={item.href} />
            ) : (
              <GenericNavIcon
                key={item.href}
                icon={<item.icon size={48} />}
                href={item.href}
                active={path === item.href}
              />
            ),
          )}
        </ul>
      </nav>
    </aside>
  );
}

function GenericNavIcon({
  icon,
  href,
  active,
}: {
  icon: React.ReactNode;
  href: string;
  active: boolean;
}) {
  const { push } = useRouter();
  return (
    <li
      key={href}
      data-active={active}
      className="data-[active=true]:opacity-100 text-stone-200 opacity-50"
    >
      <button
        type="button"
        onClick={() => push(href)}
        className="size-16 flex items-center justify-center"
      >
        {icon}
      </button>
    </li>
  );
}

function NowPlayingNavIcon() {
  const { push } = useRouter();
  const nowPlaying = useNowPlaying();

  if (!nowPlaying) {
    return (
      <GenericNavIcon
        icon={<Music4Icon size={48} />}
        href="/nowplaying"
        active={false}
      />
    );
  }

  return (
    <button
      className="size-14 flex items-center justify-center"
      type="button"
      onClick={() => push("/nowplaying")}
    >
      <img
        src={nowPlaying.meta.image}
        alt={nowPlaying.title}
        className="size-10 rounded-lg object-cover ring ring-white"
      />
    </button>
  );
}

function TopBar() {
  const { path } = useRouter();
  const currentItem = sidebarItems.find((item) => item.href === path);

  return (
    <header className="w-full h-20 p-2 flex flex-row items-center justify-between shrink-0">
      <nav className="h-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">{currentItem?.label}</h1>
      </nav>

      <div className="flex items-center justify-center px-8 space-x-2 text-stone-200 opacity-50">
        <UsbIcon size={24} />
        <BluetoothIcon size={24} />

        <span className="font-bold tabular-nums pl-3">21:13</span>
      </div>
    </header>
  );
}

export default function Main() {
  const { path } = useRouter();
  const currentItem = sidebarItems.find((item) => item.href === path);

  return (
    <main
      className="w-full h-full flex flex-row overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, transparent, transparent 30%, #4a044e30 80%, #4a044e90)",
        backgroundSize: "200vw 280vh",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />

      <section className="w-full h-full flex flex-col overflow-hidden">
        <TopBar />

        {currentItem?.view && <currentItem.view />}
      </section>
    </main>
  );
}
