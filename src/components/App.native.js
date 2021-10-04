import React, { useState, createElement, useEffect } from 'react';
import { Linking, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { View, ScrollView } from './Platform';
import { getHashParams, usePersistedState } from './Lib';
import { getRoutes } from './Menu';
import Banner from './Banner';
import Spotify from './Spotify';
import ErrorBoundary from './ErrorBoundary';

const Stack = createStackNavigator();

export default function App(props) {
  const { colors } = useTheme();
  const [spotify, setSpotify] = useState(new Spotify({}));
  const [loggedIn, setLoggedIn] = useState(spotify.loggedIn());
  const [waypoints, setWaypoints] = usePersistedState('waypoints', { track_ids: [] });
  const [playlist, setPlaylist] = usePersistedState('playlist', { track_ids: [] });
  const [size, setSize] = usePersistedState('size', 10);
  const [creativity, setCreativity] = usePersistedState('creativity', 0.5);
  const [noise, setNoise] = usePersistedState('noise', 0);
  const [route, navigate] = useState('/');
  const _navigate = useNavigation().navigate;
  const routes = getRoutes(
    waypoints, setWaypoints, size, setSize, creativity, setCreativity,
    noise, setNoise, playlist, setPlaylist, spotify, navigate, 20
  );

  function Screen(props) {
    return (
      <>
        <Banner
          loggedIn={loggedIn}
          onSelect={handleSelect}
          subtitle={props.route.params ? props.route.params.title : null}
        />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background
          }}
        >
          {['/top', '/latest', '/most_uploaded', '/search'].includes(props.route.name) ?
            <View style={{ height: '100%' }}>
              {props.route.params ?
                createElement(props.route.params.element, props.route.params) : <></>
              }
            </View> :
            <ScrollView style={{ height: '100%' }}>
              <View style={{ padding: 15 }}>
                {props.route.params ?
                  createElement(props.route.params.element, props.route.params) : <></>
                }
              </View>
            </ScrollView>
          }
        </SafeAreaView>
      </>
    );
  }

  Linking.addEventListener('url', event => {
    const params = getHashParams(event.url.substring(event.url.indexOf('?') + 1));
    setSpotify(new Spotify(params));
  });

  useEffect(() => {
    _navigate(route, routes[route]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const handleSelect = async route => {
    if (route === '/login') {
      await Linking.openURL(`${process.env.REACT_APP_API_URL}/login?state=deejai://`);
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
      <Stack.Navigator initialRouteName='/'>
        {Object.keys(routes).map(route => (
          <Stack.Screen
            key={route}
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
