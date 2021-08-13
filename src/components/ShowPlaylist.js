import { useState } from "react";
import { FaBackward, FaSave } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Playlist from './Playlist';
import { UpdatePlaylistName, UpdatePlaylistRating } from "./SavePlaylist";
import StarRating, { RateStars } from "./StarRating";

export default function ShowPlaylist({ playlist, onClose = f => f, spotify = null, userPlaylist = true }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [rateIt, setRateIt] = useState(playlist.av_rating === 0);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col>
              <div className="d-flex align-items-center">
                {(spotify && spotify.loggedIn()) ?
                  <>
                    <FaSave className="text-success" onClick={() => {
                      spotify.createNewPlayist(playlistName, playlist.track_ids)
                        .then((playlist) => {
                          setEditing(false);
                          setPlaylistUrl(playlist.external_urls.spotify);
                        });
                    }} />
                    <div style={{ width: '10px' }} />
                  </> : <></>
                }
                {playlistUrl ?
                  <a href={playlistUrl} target="_blank" rel="noreferrer">{playlistName}</a> :
                  <span onClick={() => { if (userPlaylist) setEditing(true); }}>
                    {editing ?
                      <input
                        value={playlistName}
                        onChange={(event) => setPlaylistName(event.target.value)}
                        onBlur={() => {
                          setEditing(false);
                          UpdatePlaylistName(playlist.id, playlistName);
                        }}
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
                {rateIt ?
                  <span><RateStars totalStars={5} onSelect={(rating) => {
                    UpdatePlaylistRating(
                      playlist.id,
                      (rating + playlist.av_rating) / (playlist.num_ratings + 1),
                      playlist.num_ratings + 1
                    );
                  }} /></span> :
                  <span onClick={() => setRateIt(true)}>
                    <StarRating rating={playlist.av_rating} />
                  </span>
                }
              </div>
            </Col>
          </Row>
        </Card.Title>
        <Playlist {...playlist} />
        {userPlaylist ?
          <>
            <hr />
            <div className="d-flex align-items-center justify-content-between">
              <FaBackward className="text-success" onClick={() => onClose()} />
            </div>
          </> : <></>
        }
      </Card.Body>
    </Card>
  );
}

