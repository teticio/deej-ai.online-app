import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import GeneratePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';

export default function CreatePlaylist({ onCreate = f => f }) {
  const [playlist, setPlaylist] = useState({ tracks: [] });

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Choose the waypoints in your musical journey
        </Card.Title>
        <hr />
        <AddTrack onAdd={(id) => {
          setPlaylist({ 'tracks': playlist.tracks.concat({ 'id': id }) });
        }} />
        <hr />
        <RemovablePlaylist {...playlist} onRemove={(id) => {
          setPlaylist({ 'tracks': playlist.tracks.filter((element, index) => index !== id) });
        }} />
        {playlist.tracks.length > 0?
          <hr />:
          <div />}
        <div className="d-flex align-items-center justify-content-between">
          <FaForward onClick={() => GeneratePlaylist(playlist)
            .then(playlist => {
              SavePlaylist(playlist).then(id => playlist.id = id);
              return playlist;
            })
            .then(playlist => onCreate(playlist))} />
          <FaCog onClick={() => GeneratePlaylist(playlist).then(playlist => onCreate(playlist))} />
        </div>
      </Card.Body>
    </Card>
  );
}

