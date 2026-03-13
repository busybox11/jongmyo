import { Mic2Icon } from 'lucide-react';
import ScrollableList from '../../components/main/ScrollableList';

export default function MainArtists() {
  return (
    <ScrollableList
      items={Array.from({ length: 10 }).map((_, index) => ({
        label: `Artist ${index + 1}`,
        icon: Mic2Icon,
        href: `/artist/${index + 1}`,
      }))}
    />
  );
}
