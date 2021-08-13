import Card from 'react-bootstrap/Card';
import ShowPlaylist from './ShowPlaylist';

export default function ShowPlaylists({ playlists, spotify = null }) {
  return (
    <>
      {playlists.map((playlist, i) => (
        <>
          <div style={{ marginTop: '10px' }} />
          <Card key={i} >
            <Card.Body>
              <ShowPlaylist
                playlist={playlist}
                spotify={spotify}
                userPlaylist={false}
              />
            </Card.Body>
          </Card>
        </>
      ))}
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
