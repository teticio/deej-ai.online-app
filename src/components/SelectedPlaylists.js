import React, { useReducer, useState, useEffect } from 'react';
import { Text } from './Platform';
import { VerticalSpacer } from './Lib';
import ShowPlaylists from './ShowPlaylists';

export async function getPlaylists(query, top_n) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/${query}?top_n=${top_n}`);
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function SelectedPlaylists({ query, spotify, numPlaylists = 4 }) {
  const [topN, loadMore] = useReducer(n => n + 4, numPlaylists);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getPlaylists(query, topN)
      .then(playlists => {
        setPlaylists(playlists);
      }).catch(error => console.error('Error:', error));
  }, [query, topN]);

  return (
    <>
    <ShowPlaylists
      playlists={playlists}
      spotify={spotify}
    />
        <VerticalSpacer />
        <Text h6
          onClick={loadMore}
          className='link'
          style={{ textAlign: 'center' }}
        >
          Load more...
        </Text>
    </>
  );
}
