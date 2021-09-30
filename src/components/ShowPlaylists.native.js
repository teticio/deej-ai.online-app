import React from 'react';
import { FlatList } from 'react-native';
import { Card } from './Platform';
import { VerticalSpacer } from './Lib';
import ShowPlaylist from './ShowPlaylist';

export default function ShowPlaylists({ playlists, spotify = null, header = null }) {
  const data = playlists.map((playlist, i) => {
    return {
      id: String(i),
      playlist: playlist
    }
  });

  const Item = ({ playlist }) => {
    return (
      <>
        <VerticalSpacer />
        <Card style={{ marginRight: 5, marginLeft: 5, padding: 15 }}>
          <ShowPlaylist
            playlist={playlist}
            spotify={spotify}
            userPlaylist={false}
          />
        </Card>
      </>
    );
  }

  const renderItem = ({ item }) => (
    <Item playlist={item.playlist} />
  );

  return (
    <FlatList
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={1000}
      ListHeaderComponent={header ? header : null}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
}
