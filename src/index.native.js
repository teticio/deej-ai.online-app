// TODO:
// Previous
// Spotify login

import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './components/App';

const prefix = Linking.createURL('/');

global.Buffer = global.Buffer || require('buffer').Buffer;
global.localStorage = global.localStorage || require('localStorage');

process.env.REACT_APP_API_URL = 'https://deej-ai.online/api/v1';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#ffffff',
    accent: '#00bc8c',
    surface: '#303030',
    background: '#222222'
  },
};

function Root() {
  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </NavigationContainer>
  );
}

export default registerRootComponent(Root);
