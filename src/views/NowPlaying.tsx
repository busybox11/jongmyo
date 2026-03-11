export default function NowPlaying() {
  return (
    <section className="w-full h-full p-6 flex flex-col">
      <div className="flex space-x-6">
        <div className="w-[300px] h-[300px] bg-stone-900 shadow-3xl rounded-2xl relative">
          <div className="absolute inset-0 ring-inset ring ring-white/5 rounded-2xl"></div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl text-stone-200 font-black">track name</h2>
          <h5 className="text-xl text-stone-500 font-medium -mt-1">artist name</h5>
          <h6 className="text-stone-600 mt-4">album name</h6>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mt-auto">
        <div className="flex items-center justify-between space-x-2">
          <span className="text-sm tabular-nums text-stone-600">2:41</span>
          <span className="text-sm tabular-nums text-stone-600">3:24</span>
        </div>
        
        <div className="h-2 w-full bg-stone-900 rounded-full">
          <div className="h-full w-2/3 bg-stone-600 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}