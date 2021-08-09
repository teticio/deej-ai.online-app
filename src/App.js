// TODO
// save playlist in database
// error in inspector for unique key in RemovablePlaylist
// menu & screens (login, create, explore, settings, ...)
// press button twice
// search "" => zero results
// re-write backend in fastapi to handle ws & routes?
// highlight "waypoints"
// rate playlists
// top / recent playlists
// spotify login (existing react compoent?)

import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Banner from './components/Banner';
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';

function App() {
  const [screen, setScreen] = useState('create_playlist');
  const [playlist, setPlaylist] = useState({ tracks: [] });

  return (
    <Container className="App">
      <Banner />
      {(screen === 'create_playlist') ?
        <CreatePlaylist onCreate={(playlist) => { setPlaylist(playlist); setScreen('show_playlist'); }} /> :
        (screen === 'show_playlist') ?
          <ShowPlaylist playlist={playlist} onClose={() => { setScreen('create_playlist'); }} /> : <div />}
    </Container>
  );
}

export default App;
