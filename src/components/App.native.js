import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getHashParams, ReactJSOnly, Routes, Route, Container, Card } from './Platform';
import { usePersistedState } from './Lib';
import { AboutScreen, LatestPlaylistsScreen } from './Screens';
import Banner from './Banner';
import Footer from './Footer';
import Spotify from './Spotify';
import Settings from './Settings';
import NotFound from './NotFound';
import TopPlaylists from './TopPlaylists';
import ShowPlaylist from './ShowPlaylist';
import ErrorBoundary from './ErrorBoundary';
import PrivacyPolicy from './PrivacyPolicy';
import CreatePlaylist from './CreatePlaylist';
import LatestPlaylists from './LatestPlaylists';
import SearchPlaylists from './SearchPlaylists';
import MostUploadedPlaylists from './MostUploadedPlaylists';
import About from './About';

try {
  require('./App.css');
} catch (e) { }

const Stack = createStackNavigator();

export default function App(props) {
  const hashParams = getHashParams();
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const navigate = useNavigation().navigate; //useNavigate();

  const handleSelect = route => {
    if (route === '/login') {
      window.location.href = `${process.env.REACT_APP_API_URL}/login?state=${window.location.pathname}`;
      setLoggedIn(spotify.loggedIn());
    } else if (route === '/logout') {
      spotify.logOut();
      setLoggedIn(false);
    } else {
      navigate(route);
    }
  }

  return (
    <ErrorBoundary>
      <Banner loggedIn={loggedIn} onSelect={handleSelect} />
        <Stack.Navigator initialRouteName='/about'>
        <Stack.Screen options={{headerShown: false}}
            name='/latest'
            component={LatestPlaylistsScreen}
          />
          <Stack.Screen options={{headerShown: false}}
            name='/about'
            component={AboutScreen}
          />
        </Stack.Navigator>
    </ErrorBoundary>
  );
}
