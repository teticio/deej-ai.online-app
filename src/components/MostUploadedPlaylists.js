import { useState, useEffect, useReducer } from 'react';
import { VerticalSpacer } from '../lib';
import ShowPlaylists from './ShowPlaylists';

export async function getMostUploadedPlaylists(top_n) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/most_uploads?top_n=${top_n}`);
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function MostUploadedPlaylists({ spotify }) {
  const [topN, loadMore] = useReducer(n => n + 4, 4);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getMostUploadedPlaylists(topN)
      .then(playlists => {
        setPlaylists(playlists);
      }).catch(error => console.error('Error:', error));
  }, [topN]);

  return (
    <>
      <VerticalSpacer px={10} />
      <h3 style={{ textAlign: 'center' }}>Most uploaded playlists</h3>
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
      <span onClick={loadMore}>
        <h6 className='link' style={{ textAlign: 'center' }}>Load more...</h6>
      </span>
    </>
  );
}
