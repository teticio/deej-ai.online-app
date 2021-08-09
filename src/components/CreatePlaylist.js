import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import GeneratePlaylist from './GeneratePlaylist';

export default function CreatePlaylist({ onCreate = f => f }) {
  const [playlist, setPlaylist] = useState({ tracks: [] });

  return (
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
          <FaForward onClick={() => GeneratePlaylist(playlist).then(playlist => onCreate(playlist))} />
          <FaCog onClick={() => GeneratePlaylist(playlist).then(playlist => onCreate(playlist))} />
        </div>
      </Card.Body>
    </Card>
  );
}

