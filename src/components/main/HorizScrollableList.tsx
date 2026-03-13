export default function HorizScrollableList({
  items,
}: {
  items: { label: string; image: string; href: string; subtitle: string }[];
}) {
  return (
    <div className="h-full overflow-x-auto pl-2 pr-4 -mt-6 pt-6 pb-4 w-full">
      <div className="flex flex-row space-x-6">
        {items.map((item, index) => (
          <div key={index.toString()} className="flex flex-col shrink-0">
            <img
              src={item.image}
              alt={item.label}
              className="size-40 rounded-lg object-cover shrink-0"
            />
            <p className="text-xl font-bold text-stone-200 mt-3">
              {item.label}
            </p>
            <p className="text-sm text-stone-400/50">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
