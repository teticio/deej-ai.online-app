// TODO
// menu & screens (login, create, explore, settings, ...)
// press button twice
// search "" => zero results
// backend with faiss
// re-write backend in fastapi to handle ws & routes?
// highlight "waypoints"
// rate playlists
// top / recent playlists
// spotify login (existing react compoent?)

import { useState } from "react";
import { FaPlay, FaCog } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Banner from './components/Banner';
import AddTrack from './components/AddTrack';
import Playlist from './components/Playlist';
import RemovablePlaylist from './components/RemovablePlaylist';
import GeneratePlaylist from './components/GeneratePlaylist';
import playlists from "./data/playlists.json";

function App() {
  const [playlist, setPlaylist] = useState(playlists[0]);
  const [generatedPlaylist, setGeneratedPlaylist] = useState([]);

  return (
    <Container className="App">
      <Banner />

      <Card>
        <Card.Body>

          <AddTrack onAdd={(id) => {
            setPlaylist({ 'tracks': playlist.tracks.concat({ 'id': id }) });
          }} />
          <hr />

          <RemovablePlaylist {...playlist} onRemove={(id) => {
            setPlaylist({ 'tracks': playlist.tracks.filter((element, index) => index !== id) });
          }} />
          <hr />

          <div className="d-flex align-items-center justify-content-between">
            <FaPlay onClick={() => GeneratePlaylist(playlist).then(playlist => setGeneratedPlaylist(playlist))} />
            <FaCog onClick={() => GeneratePlaylist(playlist).then(playlist => setGeneratedPlaylist(playlist))} />
          </div>

        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Playlist {...generatedPlaylist} />
        </Card.Body>
      </Card>

    </Container>
  );
}

export default App;
