import React, { useState, useEffect, createElement } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Text } from './Platform';
import { getHashParams, usePersistedState, VerticalSpacer, isElectron } from './Lib';
import Banner from './Banner';
import Footer from './Footer';
import Spotify from './Spotify';
import ErrorBoundary from './ErrorBoundary';
import { getRoutes } from './Menu';

try {
  require('./App.css');
} catch (e) { }

export default function App() {
  const hashParams = getHashParams(window.location.hash.substring(1));
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const navigate = useNavigate();
  var routes = getRoutes(
    waypoints, setWaypoints, size, setSize, creativity, setCreativity,
    noise, setNoise, playlist, setPlaylist, spotify, navigate, 4
  );

  function Screen({ element, title, params }) {
    return (
      <>
        {title ?
          <>
            <VerticalSpacer />
            <Text h4 style={{ textAlign: 'center' }}>{title}</Text>
            <VerticalSpacer />
          </> : <></>
        }
        {createElement(element, params)}
      </>
    );
  }

  useEffect(() => {
    if ('route' in hashParams) {
      navigate(hashParams.route);
    }
  }, [hashParams, navigate]);

  return (
    <ErrorBoundary>
      <Banner loggedIn={loggedIn} onSelect={route => {
        if (route === '/login') {
          let state = isElectron()? window.location.hash.substring(1): window.location.pathname;
          window.location.href = `${process.env.REACT_APP_API_URL}/login?state=${state}`;
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
              element={
                <Screen
                  element={routes[route].element}
                  title={routes[route].title}
                  params={routes[route]}
                />
              }
            />
          ))}
        </Routes>
      </Container>
      <Footer />
    </ErrorBoundary>
  );
}
