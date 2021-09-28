import React, { useState, useEffect, createElement } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getHashParams, Container } from './Platform';
import { usePersistedState } from './Lib';
import Banner from './Banner';
import Footer from './Footer';
import Spotify from './Spotify';
import ErrorBoundary from './ErrorBoundary';
import { getRoutes } from './Menu';

try {
  require('./App.css');
} catch (e) { }

export default function App() {
  const hashParams = getHashParams();
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const navigate = useNavigate();
  const routes = getRoutes(
    waypoints, setWaypoints,
    size, setSize,
    creativity, setCreativity,
    noise, setNoise, 
    playlist, setPlaylist,
    spotify, navigate
  );

  useEffect(() => {
    if ('route' in hashParams) {
      navigate(hashParams.route);
    }
  }, [hashParams, navigate]);

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
      <Container className='App'>
        <Routes initialRouteName='/'>
          {Object.keys(routes).map(route => (
            <Route
              path={route}
              element={createElement(routes[route].element, routes[route])}
            />
          ))}
        </Routes>
      </Container>
      <Footer />
    </ErrorBoundary>
  );
}
