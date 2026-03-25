import HorizScrollableList from "../../components/main/HorizScrollableList";

export default function MainPlaylists() {
  return (
    <HorizScrollableList
      items={Array.from({ length: 10 }).map((_, index) => ({
        label: `Playlist ${index + 1}`,
        image: `https://i.scdn.co/image/ab67616d00001e026c1bab854ba30713113c297a`,
        href: `/playlist/${index + 1}`,
        subtitle: `Playlist ${index + 1}`,
      }))}
    />
  );
}
