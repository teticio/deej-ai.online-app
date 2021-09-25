import React, { useState } from 'react';
import { Text, Card, Spinner, Hr, FaForward, FaCog } from './Platform';
import { VerticalSpacer, Row } from './Lib';
import AddTrack from './AddTrack';
import RemovablePlaylist from './RemovablePlaylist';
import generatePlaylist from './GeneratePlaylist';
import SavePlaylist from './SavePlaylist';

export default function CreatePlaylist({
  waypoints = { track_ids: [] },
  size = 10,
  creativity = 0.5,
  noise = 0,
  onCreate = f => f,
  onSettings = f => f,
  spotify = null,
  savePlaylist = true
}) {
  const [_waypoints, setWaypoints] = useState(waypoints);
  const [spinner, setSpinner] = useState(false);

  const handleClick = () => {
    setSpinner(true);
    generatePlaylist(_waypoints, size, creativity, noise)
      .then(playlist => {
        if (savePlaylist) {
          SavePlaylist(playlist, creativity, noise)
            .then(id => playlist.id = id);
        }
        return playlist;
      })
      .then(playlist => onCreate(playlist, _waypoints))
      .catch(error => console.error('Error:', error));
  }

  return (
    <>
      <Text h4 style={{ textAlign: 'center' }}>Choose the waypoints for your musical journey</Text>
      <AddTrack
        numTracks={_waypoints.track_ids.length}
        spotify={spotify}
        onAdd={id => {
          setWaypoints({ 'track_ids': _waypoints.track_ids.concat(id) });
        }} />
      <VerticalSpacer />
      <Card style={{ padding: 15 }}>
        <RemovablePlaylist {..._waypoints} onRemove={id => {
          setWaypoints({ 'track_ids': _waypoints.track_ids.filter((element, index) => index !== id) });
        }} />
        {_waypoints.track_ids.length > 0 ?
          <Hr /> :
          <></>
        }
        {spinner ?
          <Spinner animation='border' size='md' /> :
          <Row style={{ justifyContent: 'space-between'}} surface={true} >
            <FaForward
              data-testid='create-playlist'
              size='25'
              className='link'
              onClick={handleClick}
            />
            <FaCog
              data-testid='settings'
              size='25'
              className='link'
              onClick={() => onSettings(_waypoints)}
            />
          </Row>
        }
      </Card>
    </>
  );
}
