import React, { useState, useReducer, useEffect, Suspense } from 'react';
import { Image } from './Platform';
import { Row } from './Lib';
import ShowPlaylists from './ShowPlaylists';
import fortyFive from '../images/45.gif';

function createResource(pending) {
  let error, response;

  pending.then(r => response = r).catch(e => error = e);
  return {
    read() {
      if (error) throw error;
      if (response) return response;
      throw pending;
    }
  };
}

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

function SelectedPlaylistsComponent({ onRefresh, resource, spotify = null }) {
  const playlists = resource ? resource.read().playlists : null;

  return (
    <>
      {playlists ?
        <ShowPlaylists
          playlists={playlists}
          spotify={spotify}
          onRefresh={onRefresh}
        /> : <></>
      }
    </>
  );
}

export default function SelectedPlaylists({ query, spotify, numPlaylists = 4 }) {
  const [refresh, onRefresh] = useReducer(x => !x, false);
  const [resource, setResource] = useState(null, query);

  useEffect(() => setResource(
    createResource(new Promise(resolves => {
      getPlaylists(query, numPlaylists)
        .then(playlists => resolves({ playlists: playlists }))
        .catch(error => console.error('Error:', error))
    }))
  ), [refresh, query, numPlaylists]);

  return (
    <Suspense fallback={
      <Row style={{ flex: 1 }}>
        <Image source={fortyFive} />
      </Row>
    }>
      <SelectedPlaylistsComponent
        onRefresh={onRefresh}
        resource={resource}
        spotify={spotify}
      />
    </Suspense >
  );
}
