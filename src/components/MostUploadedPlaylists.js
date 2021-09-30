import React, { useState, useEffect, useReducer } from 'react';
import ShowPlaylists from './ShowPlaylists';
import { Text, ReactJSOnly } from './Platform';

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

export default function MostUploadedPlaylists({ spotify, numPlaylists = 4 }) {
  const [topN, loadMore] = useReducer(n => n + 4, numPlaylists);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getMostUploadedPlaylists(topN)
      .then(playlists => {
        setPlaylists(playlists);
      }).catch(error => console.error('Error:', error));
  }, [topN]);

  return (
    <>
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
      <ReactJSOnly>
        <Text h6 onClick={loadMore} className='link' style={{ textAlign: 'center' }}>
          Load more...
        </Text>
      </ReactJSOnly>
    </>
  );
}
