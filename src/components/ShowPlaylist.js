import { useState } from "react";
import { FaBackward, FaSpotify } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Playlist from './Playlist';
import { UpdatePlaylistName, UpdatePlaylistRating } from "./SavePlaylist";
import { RateStars } from "./StarRating";

export default function ShowPlaylist({ playlist, onClose = f => f, accessToken = null }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col>
              <div className="d-flex align-items-center">
                {(accessToken !== null) ?
                  <>
                    <FaSpotify className="text-success" onClick={() => console.log("spotify")} />
                    <div style={{ width: '10px' }} />
                  </> : <></>}
                <span onClick={() => setEditing(true)}>
                  {editing ?
                    <input
                      value={playlistName}
                      onChange={(event) => setPlaylistName(event.target.value)}
                      onKeyUp={(event) => {
                        if (event.keyCode === 13) {
                          setEditing(false);
                          UpdatePlaylistName(playlist.id, playlistName);
                        }
                      }}
                    /> :
                    <span>{playlistName}</span>}
                </span>
              </div>
            </Col>
            <Col>
              <div className="d-flex justify-content-end">
                <RateStars onSelect={(rating) => UpdatePlaylistRating(playlist.id, rating, 1)} />
              </div>
            </Col>
          </Row>
        </Card.Title>
        <Playlist {...playlist} />
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <FaBackward onClick={() => onClose()} />
        </div>
      </Card.Body>
    </Card>
  );
}

