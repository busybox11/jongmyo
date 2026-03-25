import HorizScrollableList from "../../components/main/HorizScrollableList";

export default function MainHome() {
  return (
    <HorizScrollableList
      items={Array.from({ length: 10 }).map((_, index) => ({
        label: `Artist ${index + 1}`,
        image: `https://i.scdn.co/image/ab67616d00001e026c1bab854ba30713113c297a`,
        href: `/artist/${index + 1}`,
        subtitle: `Artist ${index + 1}`,
      }))}
    />
  );
}
