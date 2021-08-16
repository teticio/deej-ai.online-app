// TODO
//
// frontend:
// show value of sliders in settings
// about page
// fix warnings for unique key
// fix warning about combining h2 and a in Banner
// be able to load more playlists
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
import ShowPlaylists, { GetLatestPlaylists, GetTopPlaylists } from "./components/ShowPlaylists";
import SearchScreen from "./components/SearchScreen";
import Footer from './components/Footer';

function App() {
  const [screen, setScreen] = usePersistedState('screen', 'create-playlist');
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [playlists, setPlaylists] = usePersistedState('playlists', []);
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const spotify = new Spotify();
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());

  return (
    <>
      <Container className="App">
        <Banner loggedIn={loggedIn} onSelect={(action) => {
          switch (action) {
            case 'create-playlist':
              setScreen('create-playlist');
              break;
            case 'logout-spotify':
              spotify.logOut();
              setLoggedIn(false);
              break;
            case 'login-spotify':
              window.location.href = process.env.REACT_APP_API_URL + '/login';
              setLoggedIn(spotify.loggedIn());
              break;
            case 'latest-playlists':
              GetLatestPlaylists(8)
                .then((playlists) => {
                  setPlaylists(playlists);
                  setScreen('latest-playlists');
                }).catch(error => console.error('Error:', error));
              break;
            case 'top-playlists':
              GetTopPlaylists(8)
                .then((playlists) => {
                  setPlaylists(playlists);
                  setScreen('top-playlists');
                }).catch(error => console.error('Error:', error));
              break;
            case 'search-playlists':
              setScreen('search-playlists');
              break;
            default:
              console.log(action);
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
                <>
                  <div style={{ marginTop: '10px' }} />
                  <h3 style={{ textAlign: "center" }}>Latest playlists</h3>
                  <ShowPlaylists
                    playlists={playlists}
                    spotify={spotify}
                  /></> :
                (screen === 'top-playlists') ?
                  <>
                    <div style={{ marginTop: '10px' }} />
                    <h3 style={{ textAlign: "center" }}>Top rated playlists</h3>
                    <ShowPlaylists
                      playlists={playlists}
                      spotify={spotify}
                    /></> :
                  (screen === 'search-playlists') ?
                    <SearchScreen spotify={spotify} /> :
                    <></>
        }
      </Container>
      <Footer />
    </>
  );
}

export default App;
