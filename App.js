import React from 'react';
import ShowPlaylist from './src/components/ShowPlaylist'
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { ScrollView, Text } from './src/components/Platform';

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
      <Text h1>Hello</Text>
      <ScrollView>
      <ShowPlaylist userPlaylist={true} playlist={{
        name: "Hello",
        av_rating: 3.3,
        track_ids: [
          '7dEYcnW1YSBpiKofefCFCf', '66LPSGwq2MKuFLSjAnclmg',
          '1Ulk1RYwszH5PliccyN5pF', '3ayr466SicYLcMRSCuiOSL',
          '6ijkogEt87TOoFEUdTpYxD', '2hq28hLmCPFxg2FamW6KA3',
          '4ClVhgWezpuyGhACLGBkEA', '0SzvtL65Itcs1wZrQI7hf6',
          '5bPjleBV2VtjRnc0ogJ5ib', '4tXRVDlgAhxuEmsxuW4oiQ'
        ]
      }} />
      </ScrollView>
    </PaperProvider>
  );
}
