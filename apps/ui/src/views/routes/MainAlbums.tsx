import HorizScrollableList from '../../components/main/HorizScrollableList';

export default function MainAlbums() {
  return (
    <HorizScrollableList
      items={Array.from({ length: 10 }).map((_, index) => ({
        label: `Album ${index + 1}`,
        image: `https://i.scdn.co/image/ab67616d00001e026c1bab854ba30713113c297a`,
        href: `/album/${index + 1}`,
        subtitle: `Album ${index + 1}`,
      }))}
    />
  );
}
