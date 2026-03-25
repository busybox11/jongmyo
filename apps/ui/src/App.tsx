import "@fontsource-variable/figtree";
import "./App.css";

import { RouterSync, useRouter } from "./hooks/useRouter";
import Main from "./views/Main";
import SoundCloudNowPlaying from "./views/nowplaying/soundcloud";

const App = () => {
  return (
    <>
      <RouterSync />

      <RouterOutlet />
    </>
  );
};

function RouterOutlet() {
  const { path } = useRouter();

  if (path === "/nowplaying") {
    return <SoundCloudNowPlaying />;
  }

  return <Main />;
}

export default App;
