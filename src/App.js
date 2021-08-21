// TODO
//
// frontend:
// unit tests
// ErrorBoundary
// Suspense?
// banner image and ico file
// show value of sliders in settings
// fix warnings for unique key
// fix warning about combining h2 and a in Banner
// incremental search
// selenium (pipenv install dev)
// pipenv lock
// docker, kubernetes
//
// backend:
// disable docs in prod
// set seed in noise
// bug in join the dots?

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import { usePersistedState } from "./lib";
import Banner from './components/Banner';
import Spotify from "./components/Spotify";
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';
import Settings from "./components/Settings";
import LatestPlaylists from './components/LatestPlaylists';
import TopPlaylists from './components/TopPlaylists';
import SearchPlaylists from "./components/SearchPlaylists";
import Footer from './components/Footer';
import About from './components/About';
import NotFound from './components/NotFound';
import './App.css'

function App() {
  const [route, setRoute] = usePersistedState('route', '/');
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const spotify = new Spotify();
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    navigate(route)
  }, [route, navigate]);

  return (
    <>
      <Container className="App">
        <Banner loggedIn={loggedIn} onSelect={route => {
          if (route === '/login') {
            window.location.href = `${process.env.REACT_APP_API_URL}/login?state=${window.location.pathname}`;
            setLoggedIn(spotify.loggedIn());
          } else if (route === '/logout') {
            spotify.logOut();
            setLoggedIn(false);
          } else {
            setRoute(route);
          }
        }} />
        <Routes>
          <Route
            path="/"
            element={
              <CreatePlaylist
                waypoints={waypoints}
                size={size}
                creativity={creativity}
                noise={noise}
                spotify={spotify}
                onCreate={(playlist, waypoints) => {
                  setWaypoints(waypoints);
                  setPlaylist(playlist);
                  setRoute('/playlist');
                }}
                onSettings={(waypoints) => {
                  setWaypoints(waypoints);
                  setRoute('/settings');
                }}
              />
            }
          />
          <Route
            path="/playlist"
            element={
              <ShowPlaylist
                playlist={playlist}
                onClose={() => { setRoute('/'); }}
                spotify={spotify}
                userPlaylist={true}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                size={size}
                creativity={creativity}
                noise={noise}
                onChange={(size, creativity, noise) => {
                  setSize(size);
                  setCreativity(creativity);
                  setNoise(noise);
                }}
                onClose={() => { setRoute('/'); }}
              />
            }
          />
          <Route
            path="/latest"
            element={
              <LatestPlaylists spotify={spotify} />
            }
          />
          <Route
            path="/top"
            element={
              <TopPlaylists spotify={spotify} />
            }
          />
          <Route
            path="/search"
            element={
              <SearchPlaylists spotify={spotify} />
            }
          />
          <Route
            path="/about"
            element={
              <About />
            }
          />
          <Route
            path="*"
            element={
              <NotFound />
            }
          />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
