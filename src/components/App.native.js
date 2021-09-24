import React from 'react';
import { ScrollView, View } from './Platform';
import Banner from './Banner'
import LatestPlaylists from './LatestPlaylists';

export default function App() {
  return (
    <>
      <Banner />
      <ScrollView>
        <View style={{
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <LatestPlaylists />
        </View>
      </ScrollView>
    </>
  );
}