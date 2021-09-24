import React from 'react';
import { ScrollView } from './Platform';
import LatestPlaylists from './LatestPlaylists';
import About from './About';

export function AboutScreen() {
  return (
    <ScrollView
      style={{
        paddingLeft: 15,
        paddingRight: 15
      }}>
      <About />
    </ScrollView>
  );
}

export function LatestPlaylistsScreen() {
  return (
    <ScrollView
      style={{
        paddingLeft: 15,
        paddingRight: 15
      }}>
      <LatestPlaylists />
    </ScrollView>
  );
}
