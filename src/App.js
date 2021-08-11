// TODO
// error in inspector for unique key in RemovablePlaylist
// error combining h2 and a in Banner
// search "" => zero results
// auto refresh token wrapper class
// use cookies to store spotify tokens
// highlight "waypoints"
// rate playlists
// top / recent playlists

import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Banner from './components/Banner';
import { getHashParams } from "./components/Spotify";
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';

function App() {
  const [screen, setScreen] = useState('create_playlist');
  const [playlist, setPlaylist] = useState({ tracks: [] });
  const [accessToken, setAccessToken] = useState(null);
  const params = getHashParams();

  if (!accessToken && params.access_token) {
    setAccessToken(params.access_token);
  }

  return (
    <Container className="App">
      <Banner loggedIn={accessToken !== null} onSelect={(action) => {
        switch (action) {
          case 'create_playlist':
            setScreen('create_playlist');
            break;
          case 'login_spotify':
            console.log(process.env.REACT_APP_API_URL);
            window.location.href = process.env.REACT_APP_API_URL + '/login';
            break;
          default:
            console.log(action);
        }
      }} />
      {(screen === 'create_playlist') ?
        <CreatePlaylist onCreate={(playlist) => { setPlaylist(playlist); setScreen('show_playlist'); }} /> :
        (screen === 'show_playlist') ?
          <ShowPlaylist playlist={playlist} onClose={() => { setScreen('create_playlist'); }} /> : <div />}
    </Container>
  );
}

export default App;
