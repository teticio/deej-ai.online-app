import React, { useState, useEffect } from 'react';
import { ScrollView } from './Platform';
import { getHashParams } from './Lib';
import Banner from './Banner'
import Spotify from './Spotify';
import LatestPlaylists from './LatestPlaylists';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  const hashParams = '';//getHashParams();
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());

  return (
    <ErrorBoundary>
      <Banner loggedIn={loggedIn} onSelect={route => {
        if (route === '/login') {
          window.location.href = `${process.env.REACT_APP_API_URL}/login?state=${window.location.pathname}`;
          setLoggedIn(spotify.loggedIn());
        } else if (route === '/logout') {
          spotify.logOut();
          setLoggedIn(false);
        } else {
          navigate(route);
        }
      }} />
      <ScrollView
        style={{
          paddingLeft: 15,
          paddingRight: 15
        }}>
        <LatestPlaylists />
      </ScrollView>
    </ErrorBoundary>
  );
}
