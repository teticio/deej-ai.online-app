import React, { useState, useEffect, useReducer } from 'react';
import ShowPlaylists from './ShowPlaylists';
import { ScrollView, Text } from './Platform';
import { VerticalSpacer } from './Lib';

export async function getTopPlaylists(top_n) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/top_playlists?top_n=${top_n}`);
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function TopPlaylists({ spotify }) {
  const [topN, loadMore] = useReducer(n => n + 4, 4);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getTopPlaylists(topN)
      .then(playlists => {
        setPlaylists(playlists);
      }).catch(error => console.error('Error:', error));
  }, [topN]);

  return (
    <ScrollView>
      <VerticalSpacer />
      <Text h3 style={{ textAlign: 'center' }}>Top rated playlists</Text>
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
      <Text h6 onClick={loadMore} className='link' style={{ textAlign: 'center' }}>
        Load more...
      </Text>
    </ScrollView>
  );
}
