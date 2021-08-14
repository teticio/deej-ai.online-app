// TODO
//
// frontend:
// search playlists
// fix warnings for unique key
// fix warning about combining h2 and a in Banner
// auto refresh token wrapper class
// use cookies to store spotify tokens
// be able to load more playlists
// remember state (e.g. on login)
// incremental search
// kubernetes
//
// backend:
// re-factor join_the_dots and make_playlist
// handle exceptions from spotify
// set seed in noise
// bug in join the dots?
// get_similar

import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Banner from './components/Banner';
import Spotify from "./components/Spotify";
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';
import Settings from "./components/Settings";
import ShowPlaylists, { GetLatestPlaylists, GetTopPlaylists } from "./components/ShowPlaylists";
import Footer from './components/Footer';

function App() {
  const [screen, setScreen] = useState('create-playlist');
  const [waypoints, setWaypoints] = useState({ track_ids: [] });
  const [playlist, setPlaylist] = useState({ track_ids: [] });
  const [playlists, setPlaylists] = useState([]);
  const [size, setSize] = useState(10);
  const [creativity, setCreativity] = useState(0.5);
  const [noise, setNoise] = useState(0);
  const spotify = new Spotify();

  return (
    <>
      <Container className="App">
        <Banner loggedIn={spotify.loggedIn()} onSelect={(action) => {
          switch (action) {
            case 'create-playlist':
              setScreen('create-playlist');
              break;
            case 'login-spotify':
              window.location.href = process.env.REACT_APP_API_URL + '/login';
              break;
            case 'latest-playlists':
              GetLatestPlaylists(8)
                .then((playlists) => {
                  setPlaylists(playlists);
                  setScreen('latest-playlists');
                });
              break;
            case 'top-playlists':
              GetTopPlaylists(8)
                .then((playlists) => {
                  setPlaylists(playlists);
                  setScreen('top-playlists');
                });
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
                  <></>
        }
      </Container>
      <Footer />
    </>
  );
}

export default App;
