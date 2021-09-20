import React from 'react';
import SearchPlaylists from './src/components/SearchPlaylists'
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

global.Buffer = global.Buffer || require('buffer').Buffer;

//process.env.REACT_APP_API_URL = 'https://deej-ai.online/api/v1';
process.env.REACT_APP_API_URL = 'http://192.168.0.225:8001/api/v1';

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

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SearchPlaylists/>
    </PaperProvider>
  );
}
