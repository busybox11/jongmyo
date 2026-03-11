import {
  BluetoothIcon,
  DiscAlbumIcon,
  HomeIcon,
  LibraryIcon,
  ListMusicIcon,
  Mic2Icon,
  Music4Icon,
  UsbIcon,
} from 'lucide-react';
import { useNowPlaying } from '../hooks/useNowPlaying';

const sidebarItems = [
  {
    icon: HomeIcon,
    label: 'Home',
    href: '/',
  },
  {
    icon: Music4Icon,
    label: 'Now playing',
    href: '/nowplaying',
  },
  {
    icon: LibraryIcon,
    label: 'Library',
    href: '/library',
  },
  {
    icon: ListMusicIcon,
    label: 'Playlists',
    href: '/playlists',
  },
  {
    icon: Mic2Icon,
    label: 'Artists',
    href: '/artists',
  },
  {
    icon: DiscAlbumIcon,
    label: 'Albums',
    href: '/albums',
  },
];

function Sidebar() {
  const active = '/';

  return (
    <aside className="w-20 h-full">
      <nav className="h-full overflow-y-auto">
        <ul className="flex flex-col items-center justify-center space-y-2 p-2">
          {sidebarItems.map((item) =>
            item.href === '/nowplaying' ? (
              <NowPlayingNavIcon key={item.href} />
            ) : (
              <GenericNavIcon
                key={item.href}
                icon={<item.icon size={48} />}
                href={item.href}
                active={active === item.href}
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
  return (
    <li
      key={href}
      data-active={active}
      className="data-[active=true]:opacity-100 text-stone-200 opacity-50"
    >
      <a href={href} className="size-16 flex items-center justify-center">
        {icon}
      </a>
    </li>
  );
}

function NowPlayingNavIcon() {
  const nowPlaying = useNowPlaying();

  if (!nowPlaying) {
    return (
      <div className="size-14 flex items-center justify-center">
        <Music4Icon size={48} />
      </div>
    );
  }

  return (
    <div className="size-14 flex items-center justify-center">
      <img
        src={nowPlaying.meta.image}
        alt={nowPlaying.title}
        className="size-10 rounded-lg object-cover ring ring-white"
      />
    </div>
  );
}

function TopBar() {
  return (
    <header className="w-full h-20 p-2 flex flex-row items-center justify-between">
      <nav className="h-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jongmyo</h1>
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
  return (
    <main className="w-full h-full flex flex-row">
      <Sidebar />

      <section className="w-full">
        <TopBar />

        <div className="flex-1"></div>
      </section>
    </main>
  );
}
