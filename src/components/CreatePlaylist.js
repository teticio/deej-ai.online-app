import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import GeneratePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';

export default function CreatePlaylist({ waypoints = { track_ids: [] }, size = 10, creativity = 0.5, noise = 0, onCreate = f => f, onSettings = f => f }) {
  const [_waypoints, setWaypoints] = useState(waypoints);
  const [spinner, setSpinner] = useState(false);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Choose the waypoints in your musical journey
        </Card.Title>
        <AddTrack onAdd={(id) => {
          setWaypoints({ 'track_ids': _waypoints.track_ids.concat(id) });
        }} />
        <hr />
        <RemovablePlaylist {..._waypoints} onRemove={(id) => {
          setWaypoints({ 'track_ids': _waypoints.track_ids.filter((element, index) => index !== id) });
        }} />
        {_waypoints.track_ids.length > 0 ?
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
                GeneratePlaylist(_waypoints, size, creativity, noise)
                  .then(playlist => {
                    SavePlaylist(playlist).then(id => playlist.id = id);
                    return playlist;
                  })
                  .then(playlist => onCreate(playlist, _waypoints))
              }}
            />
            <FaCog
              size="25"
              className="text-success"
              onClick={() => onSettings(_waypoints)}
            />
          </div>}
      </Card.Body>
    </Card>
  );
}
