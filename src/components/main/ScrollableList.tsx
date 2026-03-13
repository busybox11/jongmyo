import type { LucideIcon } from 'lucide-react';

export default function ScrollableList({
  items,
}: {
  items: { label: string; icon: LucideIcon; href: string }[];
}) {
  return (
    <div className="h-full overflow-y-auto pl-2 pr-4 -mt-6 pt-4 pb-4">
      <div className="flex flex-col space-y-4">
        {items.map((item, index) => (
          <div key={index.toString()} className="w-full flex items-center">
            <div className="size-10 rounded-full bg-white/5 ring-1 ring-inset ring-white/15 mr-4 flex items-center justify-center">
              <item.icon size={36} />
            </div>
            <p className="">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
