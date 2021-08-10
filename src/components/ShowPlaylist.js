import { useState } from "react";
import { FaBackward } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Playlist from './Playlist';
import { UpdatePlaylistName, UpdatePlaylistRating } from "./SavePlaylist";
import { RateStars } from "./StarRating";

export default function ShowPlaylist({ playlist, onClose = f => f }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col onClick={() => setEditing(true)}>
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
                <p>{playlistName}</p>}
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

