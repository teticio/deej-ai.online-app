// TODO
//
// frontend:
// banner image and ico file
// show value of sliders in settings
// fix warnings for unique key
// fix warning about combining h2 and a in Banner
// incremental search
// selenium (pipenv install dev)
// pipenv lock
// docker, kubernetes
//
// backend:
// disable docs in prod
// set seed in noise
// bug in join the dots?

import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { usePersistedState } from "./lib";
import Banner from './components/Banner';
import Spotify from "./components/Spotify";
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';
import Settings from "./components/Settings";
import LatestPlaylists from './components/LatestPlaylists';
import TopPlaylists from './components/TopPlaylists';
import SearchPlaylists from "./components/SearchPlaylists";
import Footer from './components/Footer';
import About from './components/About';
import './App.css'

function App() {
  const [screen, setScreen] = usePersistedState('screen', 'create-playlist');
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const spotify = new Spotify();
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());

  return (
    <>
      <Container className="App">
        <Banner loggedIn={loggedIn} onSelect={(action) => {
          if (action === 'login-spotify') {
            window.location.href = process.env.REACT_APP_API_URL + '/login';
            setLoggedIn(spotify.loggedIn());
          } else if (action === 'logout-spotify') {
            spotify.logOut();
            setLoggedIn(false);
          } else {
            setScreen(action);
          }
        }} />
        {(screen === 'create-playlist') ?
          <CreatePlaylist
            waypoints={waypoints}
            size={size}
            creativity={creativity}
            noise={noise}
            spotify={spotify}
            onCreate={(playlist, waypoints) => {
              setWaypoints(waypoints);
              setPlaylist(playlist);
              setScreen('show-playlist');
            }}
            onSettings={(waypoints) => {
              setWaypoints(waypoints);
              setScreen('show-settings');
            }}
          /> :
          (screen === 'show-playlist') ?
            <ShowPlaylist
              playlist={playlist}
              onClose={() => { setScreen('create-playlist'); }}
              spotify={spotify}
              userPlaylist={true}
            /> :
            (screen === 'show-settings') ?
              <Settings
                size={size}
                creativity={creativity}
                noise={noise}
                onChange={(size, creativity, noise) => {
                  setSize(size);
                  setCreativity(creativity);
                  setNoise(noise);
                }}
                onClose={() => { setScreen('create-playlist'); }}
              /> :
              (screen === 'latest-playlists') ?
                <LatestPlaylists spotify={spotify} /> :
                (screen === 'top-playlists') ?
                  <TopPlaylists spotify={spotify} /> :
                  (screen === 'search-playlists') ?
                    <SearchPlaylists spotify={spotify} /> :
                    (screen === 'about') ?
                      <About /> :
                      <></>
        }
      </Container>
      <Footer />
    </>
  );
}

export default App;
