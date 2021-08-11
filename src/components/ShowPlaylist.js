import { useState } from "react";
import { FaBackward, FaSpotify } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Playlist from './Playlist';
import { UpdatePlaylistName, UpdatePlaylistRating } from "./SavePlaylist";
import { RateStars } from "./StarRating";

export default function ShowPlaylist({ playlist, onClose = f => f, spotify = null }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistUrl, setPlaylistUrl] = useState(null);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col>
              <div className="d-flex align-items-center">
                {spotify.loggedIn() ?
                  <>
                    <FaSpotify className="text-success" onClick={() => {
                      spotify.createNewPlayist(playlistName, playlist.tracks)
                        .then((playlist) => {
                          setEditing(false);
                          setPlaylistUrl(playlist.external_urls.spotify);
                        });
                    }} />
                    <div style={{ width: '10px' }} />
                  </> : <></>
                }
                {(playlistUrl) ?
                  <a href={playlistUrl} target="_blank" rel="noreferrer">{playlistName}</a> :
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
                      <span>{playlistName}</span>
                    }
                  </span>
                }
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

