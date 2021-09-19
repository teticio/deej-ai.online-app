import React from 'react';
import About from './src/components/About'
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
      <About />
    </PaperProvider>
  );
}
