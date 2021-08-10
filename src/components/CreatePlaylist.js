import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import GeneratePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';

export default function CreatePlaylist({ onCreate = f => f }) {
  const [playlist, setPlaylist] = useState({ tracks: [] });
  const [spinner, setSpinner] = useState(false);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Choose the waypoints in your musical journey
        </Card.Title>
        <AddTrack onAdd={(id) => {
          setPlaylist({ 'tracks': playlist.tracks.concat({ 'id': id }) });
        }} />
        <hr />
        <RemovablePlaylist {...playlist} onRemove={(id) => {
          setPlaylist({ 'tracks': playlist.tracks.filter((element, index) => index !== id) });
        }} />
        {playlist.tracks.length > 0 ?
          <hr /> :
          <div />}
        {spinner ?
          <Spinner animation="border" /> :
          <div className="d-flex align-items-center justify-content-between">
            <FaForward onClick={() => {
              setSpinner(true);
              GeneratePlaylist(playlist)
                .then(playlist => {
                  SavePlaylist(playlist).then(id => playlist.id = id);
                  return playlist;
                })
                .then(playlist => onCreate(playlist))
            }} />
            <FaCog onClick={() => { console.log('settings'); }} />
          </div>}
      </Card.Body>
    </Card>
  );
}

