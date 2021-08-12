import { useState } from "react";
import { FaSpotify } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Playlist from './Playlist';
import { UpdatePlaylistRating } from "./SavePlaylist";
import StarRating, { RateStars } from "./StarRating";

export default function ShowPlaylists({ playlists }) {
  const [rateIt, setRateIt] = useState(Array.from({ length: playlists.length }, (x, i) => playlists[i].av_rating === 0));
  const [ratedIt, setRatedIt] = useState(Array.from({ length: playlists.length }, () => 0));
  return (
    <>
      {playlists.map((playlist, i) => (
        <>
          <div style={{ marginTop: '10px' }} />
          <Card key={i} >
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>
                    <span>{playlist.name}</span>
                  </Col>
                  <Col>
                    <div className="d-flex justify-content-end">
                      {rateIt[i] ?
                        <span><RateStars totalStars={5} onSelect={(rating) => {
                          playlist.num_ratings = playlist.num_ratings + 1;
                          playlist.av_rating = (rating + playlist.av_rating) / playlist.num_ratings;
                          UpdatePlaylistRating(playlist.id, playlist.av_rating, playlist.num_ratings);
                          setRateIt([...rateIt.slice(0, i), false, ...rateIt.slice(i + 1)]);
                          setRatedIt([...ratedIt.slice(0, i), true, ...ratedIt.slice(i + 1)]);
                        }} /></span> :
                        <span onClick={() => {
                          if (!ratedIt[i]) {
                            setRateIt([...rateIt.slice(0, i), true, ...rateIt.slice(i + 1)]);
                          }
                        }}><StarRating rating={playlist.av_rating} /></span>
                      }
                    </div>
                  </Col>
                </Row>
              </Card.Title>
              <Playlist {...playlist} />
            </Card.Body>
          </Card>
        </>
      ))}
    </>
  );
}

export async function GetLatestPlaylists(top_n) {
  try {
    const response = await fetch('/latest_playlists?top_n=' + top_n);
    const playlists = await response.json();
    playlists.forEach((playlist, i) => {
      playlists[i].tracks = JSON.parse(playlist.tracks)
      playlists[i].waypoints = JSON.parse(playlist.waypoints)
    });
    return playlists;
  } catch (error) {
    console.error('Error:', error);
  };
}

export async function GetTopPlaylists(top_n) {
  try {
    const response = await fetch('/top_playlists?top_n=' + top_n);
    const playlists = await response.json();
    playlists.forEach((playlist, i) => {
      playlists[i].tracks = JSON.parse(playlist.tracks)
      playlists[i].waypoints = JSON.parse(playlist.waypoints)
    });
    return playlists;
  } catch (error) {
    console.error('Error:', error);
  };
}
