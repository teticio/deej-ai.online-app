import React from 'react';
import { Container } from './Platform';
import Banner from './Banner'
import LatestPlaylists from './LatestPlaylists';

export default function App() {
  return (
    <>
      <Banner />
      <Container>
          <LatestPlaylists />
      </Container>
    </>
  );
}