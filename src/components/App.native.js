import React, { useState, createElement, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getHashParams, ScrollView } from './Platform';
import { usePersistedState } from './Lib';
import { getRoutes } from './Menu';
import Banner from './Banner';
import Spotify from './Spotify';
import ErrorBoundary from './ErrorBoundary';

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
  const _navigate = useNavigation().navigate;
  const routes = getRoutes(
    waypoints, setWaypoints,
    size, setSize,
    creativity, setCreativity,
    noise, setNoise, 
    playlist, setPlaylist,
    spotify, navigate 
  );


  useEffect(() => {
    _navigate(route, routes[route]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

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
      <Stack.Navigator initialRouteName='/'>
        {Object.keys(routes).map(route => (
          <Stack.Screen
            options={{ headerShown: false }}
            name={route}
            component={Screen}
            initialParams={routes[route]}
          />
        ))}
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
