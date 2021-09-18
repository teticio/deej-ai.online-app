import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { getHashParams, usePersistedState } from './components/Lib';
import Banner from './components/Banner';
import Spotify from './components/Spotify';
import ErrorBoundary from './components/ErrorBoundary';
import CreatePlaylist from './components/CreatePlaylist';
import ShowPlaylist from './components/ShowPlaylist';
import Settings from './components/Settings';
import LatestPlaylists from './components/LatestPlaylists';
import TopPlaylists from './components/TopPlaylists';
import MostUploadedPlaylists from './components/MostUploadedPlaylists';
import SearchPlaylists from './components/SearchPlaylists';
import Footer from './components/Footer';
import About from './components/About';
import NotFound from './components/NotFound';
import PrivacyPolicy from './components/PrivacyPolicy';
import './App.css'

function App() {
  const hashParams = getHashParams();
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const navigate = useNavigate();

  useEffect(() => {
    if ('route' in hashParams) {
      navigate(hashParams.route);
    }
  }, [hashParams, navigate]);

  return (
    <>
      <Container className='App'>
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
        <ErrorBoundary >
          <Routes>
            <Route
              path='/'
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
                    navigate('/playlist');
                  }}
                  onSettings={waypoints => {
                    setWaypoints(waypoints);
                    navigate('/settings');
                  }}
                />
              }
            />
            <Route
              path='/playlist'
              element={
                <ShowPlaylist
                  playlist={playlist}
                  onClose={() => navigate('/')}
                  spotify={spotify}
                  userPlaylist={true}
                />
              }
            />
            <Route
              path='/settings'
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
                  onClose={() => navigate('/')}
                />
              }
            />
            <Route
              path='/latest'
              element={
                <LatestPlaylists spotify={spotify} />
              }
            />
            <Route
              path='/top'
              element={
                <TopPlaylists spotify={spotify} />
              }
            />
            <Route
              path='/most_uploaded'
              element={
                <MostUploadedPlaylists spotify={spotify} />
              }
            />
            <Route
              path='/search'
              element={
                <SearchPlaylists spotify={spotify} />
              }
            />
            <Route
              path='/about'
              element={
                <About />
              }
            />
            <Route
              path='/privacy_policy'
              element={
                <PrivacyPolicy />
              }
            />
            <Route
              path='/privacy_policy.html'
              element={
                <PrivacyPolicy />
              }
            />
            <Route
              path='*'
              element={
                <NotFound />
              }
            />
          </Routes>
        </ErrorBoundary>
      </Container>
      <Footer />
    </>
  );
}

export default App;
