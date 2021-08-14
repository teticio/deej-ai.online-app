import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import GeneratePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';

export default function CreatePlaylist({ size = 10, creativity = 0.5, noise = 0, onCreate = f => f, onSettings = f => f }) {
  const [playlist, setPlaylist] = useState({ track_ids: [] });
  const [spinner, setSpinner] = useState(false);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Choose the waypoints in your musical journey
        </Card.Title>
        <AddTrack onAdd={(id) => {
          setPlaylist({ 'track_ids': playlist.track_ids.concat(id) });
        }} />
        <hr />
        <RemovablePlaylist {...playlist} onRemove={(id) => {
          setPlaylist({ 'track_ids': playlist.track_ids.filter((element, index) => index !== id) });
        }} />
        {playlist.track_ids.length > 0 ?
          <hr /> :
          <></>
        }
        {spinner ?
          <Spinner animation="border" size="md" /> :
          <div className="d-flex align-items-center justify-content-between">
            <FaForward
              size="25"
              className="text-success"
              onClick={() => {
                setSpinner(true);
                GeneratePlaylist(playlist, size, creativity, noise)
                  .then(playlist => {
                    SavePlaylist(playlist).then(id => playlist.id = id);
                    return playlist;
                  })
                  .then(playlist => onCreate(playlist))
              }}
            />
            <FaCog
              size="25"
              className="text-success"
              onClick={() => onSettings()}
            />
          </div>}
      </Card.Body>
    </Card>
  );
}
