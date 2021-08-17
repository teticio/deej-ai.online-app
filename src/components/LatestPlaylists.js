import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import ShowPlaylists from "./ShowPlaylists";

export async function getLatestPlaylists(top_n) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/latest_playlists?top_n=' + top_n);
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function LatestPlaylists({ spotify }) {
  const [topN,] = useState(() => 8);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getLatestPlaylists(topN)
      .then((playlists) => {
        setPlaylists(playlists);
      }).catch(error => console.error('Error:', error));
  }, [topN]);

  return (
    <Container>
      <div style={{ marginTop: '10px' }} />
      <h3 style={{ textAlign: "center" }}>Latest playlists</h3>
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
    </Container >
  );
}
