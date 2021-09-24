import React, { useState, createElement, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getHashParams, ReactJSOnly, Routes, Route, Container, Card } from './Platform';
import { ScrollView } from './Platform';
import { usePersistedState } from './Lib';
import About from './About';
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

try {
  require('./App.css');
} catch (e) { }

const Stack = createStackNavigator();

export function Screen(props) {
  return (
    <ScrollView
      style={{
        paddingLeft: 15,
        paddingRight: 15
      }}>
      {props.route.params ?
        createElement(props.route.params.element, props.route.params) : <></>}
    </ScrollView>
  );
}

export default function App(props) {
  const hashParams = getHashParams();
  const spotify = new Spotify(hashParams);
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const [route, navigate] = useState('/');
  
  const routeParams = {
    '/': {
      element: CreatePlaylist,
      waypoints: waypoints,
      size: size,
      creativity: creativity,
      noise: noise,
      spotify: spotify,
      onCreate: (playlist, waypoints) => {
        setWaypoints(waypoints);
        setPlaylist(playlist);
        navigate('/playlist');
      },
      onSettings: waypoints => {
        setWaypoints(waypoints);
        navigate('/settings');
      }
    },
    '/playlist': {
      element: ShowPlaylist,
      playlist: playlist,
      onClose: () => navigate('/'),
      spotify: spotify,
      userPlaylist: true
    },
    '/settings': {
      element: Settings,
      size: size,
      creativity: creativity,
      noise: noise,
      onChange: (size, creativity, noise) => {
        setSize(size !== '' ? size : 0);
        setCreativity(creativity);
        setNoise(noise);
      },
      onClose: () => navigate('/')
    },
    '/latest': {
      element: LatestPlaylists,
      spotify: spotify
    },
    '/top': {
      element: TopPlaylists,
      spotify: spotify
    },
    '/most_uploaded': {
      element: MostUploadedPlaylists,
      spotify: spotify
    },
    '/search': {
      element: SearchPlaylists,
      spotify: spotify
    },
    '/about': {
      element: About
    },
    '/privacy_policy': {
      element: PrivacyPolicy
    },
    '/privacy_policy.html': {
      element: PrivacyPolicy
    },
    '*': {
      element: NotFound
    }
  };

  const _navigate = useNavigation().navigate;

  useEffect(() => {
    _navigate(route, routeParams[route]);
  }, [route]);

  const handleSelect = route => {
    if (route === '/login') {
      window.location.href = `${process.env.REACT_APP_API_URL}/login?state=${window.location.pathname}`;
      setLoggedIn(spotify.loggedIn());
    } else if (route === '/logout') {
      spotify.logOut();
      setLoggedIn(false);
    } else if (route in routeParams) {
      navigate(route);
    } else {
      navigate('*');
    }
  }

  return (
    <ErrorBoundary>
      <Banner loggedIn={loggedIn} onSelect={handleSelect} />
      <Stack.Navigator initialRouteName='/'>
        {Object.keys(routeParams).map((route) => (
          <Stack.Screen
            options={{ headerShown: false }}
            name={route}
            component={Screen}
            initialParams={routeParams[route]}
          />
        ))}
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
