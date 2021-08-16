import { useState } from "react";
import { FaBackward, FaSave, FaPen } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Playlist from './Playlist';
import { UpdatePlaylistName, UpdatePlaylistRating, UpdatePlaylistId } from "./SavePlaylist";
import StarRating, { RateStars } from "./StarRating";
import Footer from './Footer';

export default function ShowPlaylist({ playlist, onClose = f => f, spotify = null, userPlaylist = false }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [rateIt, setRateIt] = useState(playlist.av_rating === 0);
  const [spinner, setSpinner] = useState(false);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col>
                <div className="d-flex align-items-center">
                  {(spotify && spotify.loggedIn()) ?
                    <>
                      {spinner ?
                        <Spinner animation="border" size="md" /> :
                        <FaSave size="25"
                          className="text-success"
                          onClick={() => {
                            setSpinner(true);
                            spotify.autoRefresh(() => spotify.createNewPlayist(playlistName, playlist.track_ids))
                              .then((spotify_playlist) => {
                                setSpinner(false);
                                setEditing(false);
                                setPlaylistUrl(spotify_playlist.external_urls.spotify);
                                if (userPlaylist) {
                                  UpdatePlaylistId(playlist.id, spotify_playlist.owner.id, spotify_playlist.id)
                                    .catch(error => console.error('Error:', error));
                                }
                              }).catch(error => console.error('Error:', error));
                          }}
                        />}
                      <div style={{ width: '10px' }} />
                    </> : <></>
                  }
                  {playlistUrl ?
                    <a
                      href={playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                    >{playlistName}</a> :
                    <span onClick={() => { if (userPlaylist) setEditing(true); }}>
                      {editing ?
                        <input
                          value={playlistName}
                          onChange={event => setPlaylistName(event.target.value)}
                          onBlur={() => {
                            setEditing(false);
                            UpdatePlaylistName(playlist.id, playlistName)
                              .catch(error => console.error('Error:', error));
                          }}
                          onKeyUp={event => {
                            if (event.key === 'Enter') {
                              setEditing(false);
                              UpdatePlaylistName(playlist.id, playlistName)
                                .catch(error => console.error('Error:', error));
                            }
                          }}
                        /> :
                        <div className="d-flex">
                          {playlistName}
                          {userPlaylist ?
                            <>
                              <div style={{ width: '10px' }} />
                              <FaPen size="15" className="text-success" />
                            </> :
                            <></>
                          }
                        </div>
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
                      ).catch(error => console.error('Error:', error));
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
                <FaBackward
                  size="25"
                  className="text-success"
                  onClick={() => onClose()}
                />
              </div>
            </> : <></>
          }
        </Card.Body>
      </Card>
      <Footer />
    </>
  );
}

