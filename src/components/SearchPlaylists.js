import React, { useState, useEffect, useReducer } from 'react';
import { Dimensions } from 'react-native';
import ShowPlaylists from './ShowPlaylists';
import { View, ScrollView, Card, Text, TextInput, FaSearch } from './Platform';
import { Row, HorizontalSpacer, VerticalSpacer } from './Lib';

export async function searchPlaylists(searchString, maxItems) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/search_playlists` +
    '?string=' + encodeURIComponent(searchString) +
    '&max_items=' + encodeURIComponent(maxItems));
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function SearchPlaylists({ spotify }) {
  const [topN, loadMore] = useReducer(n => n + 4, 4);
  const [playlists, setPlaylists] = useState([]);
  const [editing, setEditing] = useState(true);
  const [searchString, setSearchString] = useState('');
  const [actualSearchString, setActualSearchString] = useState('');

  const handleUpdate = () => {
    setActualSearchString(searchString);
    setEditing(false);
  }

  useEffect(() => {
    if (actualSearchString === '') {
      setPlaylists([]);
    } else {
      searchPlaylists(actualSearchString, topN)
        .then(playlists => {
          setPlaylists(playlists);
        }).catch(error => console.error('Error:', error));
    }
  }, [actualSearchString, topN]);

  return (
    <ScrollView>
      <Text h3 style={{ textAlign: 'center' }}>Search playlists</Text>
      <Card>
        <Text onClick={() => setEditing(true)}>
          <Row style={{ justifyContent: 'flex-start', padding: 10 }} surface={true}>
            {editing ?
              <View style={{ width: Math.max(Dimensions.get('window').width, Dimensions.get('window').height) }}>
                <TextInput
                  placeholder='Search...'
                  value={searchString}
                  onChange={event => setSearchString(event.target.value)}
                  onChangeText={value => setSearchString(value)}
                  onBlur={handleUpdate}
                  onKeyUp={event => {
                    if (event.key === 'Enter') {
                      handleUpdate();
                    }
                  }}
                />
              </View> :
              <>
                <FaSearch />
                <HorizontalSpacer />
                <Text>{searchString}</Text>
              </>
            }
          </Row>
        </Text>
      </Card>
      <VerticalSpacer />
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
      {
        actualSearchString !== '' ?
          <Text h6 onClick={loadMore} className='link' style={{ textAlign: 'center' }}>
            Load more...
          </Text> : <></>
      }
    </ScrollView>
  );
}
