import { useState } from "react";
import { FaForward, FaCog } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import generatePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';
import { VerticalSpacer } from "../lib";

export default function CreatePlaylist({
  waypoints = { track_ids: [] },
  size = 10,
  creativity = 0.5,
  noise = 0,
  onCreate = f => f,
  onSettings = f => f,
  spotify = null
}) {
  const [_waypoints, setWaypoints] = useState(waypoints);
  const [spinner, setSpinner] = useState(false);

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Choose the waypoints for your musical journey</h3>
      <AddTrack
        numTracks={_waypoints.track_ids.length}
        spotify={spotify}
        onAdd={(id) => {
          setWaypoints({ 'track_ids': _waypoints.track_ids.concat(id) });
        }} />
      <VerticalSpacer px={10} />
      <Card>
        <Card.Body>
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
                className="link"
                onClick={() => {
                  setSpinner(true);
                  generatePlaylist(_waypoints, size, creativity, noise)
                    .then(playlist => {
                      SavePlaylist(playlist, creativity, noise).then(id => playlist.id = id);
                      return playlist;
                    })
                    .then(playlist => onCreate(playlist, _waypoints))
                    .catch(error => console.error('Error:', error));
                }}
              />
              <FaCog
                size="25"
                className="link"
                onClick={() => onSettings(_waypoints)}
              />
            </div>}
        </Card.Body>
      </Card>
    </>
  );
}
