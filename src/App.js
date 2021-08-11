// TODO
//
// frontend:
// settings
// add tests for database (need to be able to delete playlist first)
// fix warnings for unique key
// fix warning about combining h2 and a in Banner
// search "" => zero results
// auto refresh token wrapper class
// use cookies to store spotify tokens
// highlight "waypoints"
// add spotify icons to top / latest playlists - refactor?
// be able to load more playlists
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
import ShowPlaylists, { GetLatestPlaylists, GetTopPlaylists } from "./components/ShowPlaylists";

function App() {
  const [screen, setScreen] = useState('create_playlist');
  const [playlist, setPlaylist] = useState({ tracks: [] });
  const [playlists, setPlaylists] = useState([]);
  const spotify = new Spotify();

  return (
    <Container className="App">
      <Banner loggedIn={spotify.loggedIn()} onSelect={(action) => {
        switch (action) {
          case 'create_playlist':
            setScreen('create_playlist');
            break;
          case 'login_spotify':
            window.location.href = process.env.REACT_APP_API_URL + '/login';
            break;
          case 'latest_playlists':
            GetLatestPlaylists(8)
              .then((playlists) => {
                setPlaylists(playlists);
                setScreen('latest_playlists');
              });
            break;
          case 'top_playlists':
            GetTopPlaylists(8)
              .then((playlists) => {
                setPlaylists(playlists);
                setScreen('top_playlists');
              });
            break;
          default:
            console.log(action);
        }
      }} />
      {(screen === 'create_playlist') ?
        <CreatePlaylist onCreate={(playlist) => { setPlaylist(playlist); setScreen('show_playlist'); }} /> :
        (screen === 'show_playlist') ?
          <ShowPlaylist
            playlist={playlist}
            onClose={() => { setScreen('create_playlist'); }}
            spotify={spotify}
          /> : (screen === 'latest_playlists') ?
            <>
              <div style={{ marginTop: '10px' }} />
              <h3 style={{ textAlign: "center" }}>Latest playlists</h3>
              <ShowPlaylists
                playlists={playlists}
              /></> : (screen === 'top_playlists') ?
              <>
                <div style={{ marginTop: '10px' }} />
                <h3 style={{ textAlign: "center" }}>Top rated playlists</h3>
                <ShowPlaylists
                  playlists={playlists}
                /></> :
              <></>
      }
    </Container>
  );
}

export default App;
