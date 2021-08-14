import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';
import { createArray } from '../lib';
import ShowPlaylist from './ShowPlaylist';
import Footer from './Footer';

export default function ShowPlaylists({ playlists, spotify = null }) {
  return (
    <>
      {createArray(playlists.length / 2).map((x, i) => (
        <>
          <Row>
            {createArray(2).map((x, j) => (
              (2 * i + j < playlists.length) ?
                <Col lg="6">
                  <div style={{ marginTop: '10px' }} />
                  <Card key={2 * i + j} >
                    <Card.Body>
                      <ShowPlaylist
                        playlist={playlists[2 * i + j]}
                        spotify={spotify}
                        userPlaylist={false}
                      />
                    </Card.Body>
                  </Card>
                </Col> : <></>
            ))}
          </Row>
        </>
      ))}
      <Footer />
    </>
  );
}

export async function GetLatestPlaylists(top_n) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + '/latest_playlists?top_n=' + top_n);
    const playlists = await response.json();
    playlists.forEach((playlist, i) => {
      playlists[i].track_ids = JSON.parse(playlist.track_ids)
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
    const response = await fetch(process.env.REACT_APP_API_URL + '/top_playlists?top_n=' + top_n);
    const playlists = await response.json();
    playlists.forEach((playlist, i) => {
      playlists[i].track_ids = JSON.parse(playlist.track_ids)
      playlists[i].tracks = JSON.parse(playlist.tracks)
      playlists[i].waypoints = JSON.parse(playlist.waypoints)
    });
    return playlists;
  } catch (error) {
    console.error('Error:', error);
  };
}
