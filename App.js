import React from 'react';
import Playlist from './src/components/Playlist'
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

global.Buffer = global.Buffer || require('buffer').Buffer;

process.env.REACT_APP_API_URL = 'https://deej-ai.online/api/v1';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Playlist track_ids={[
        "1O0xeZrBDbq7HPREdmYUYK", "6Y0ed41KYLRnJJyYGGaDgY",
        "5yrsBzgHkfu2idkl2ILQis", "6yXcmVKGjFofPWvW9ustQX",
        "1DKyFVzIh1oa1fFnEmTkIl", "6b8hjwuGl1H9o5ZbrHJcpJ",
        "5qRJD1yaLJ5s0J3JpbgnwA", "6kotXaSQaGYxE62hVpdHWu",
        "4lrQv8z3qq1Rl8bsc0Qy0y", "2nmaEzFZrSm2aMLtfJDzyG",
        "3PPDUkGHUJx2bxct6A3PBy", "1b7LMtXCXGc2EwOIplI35z"
      ]} />
    </PaperProvider>
  );
}
