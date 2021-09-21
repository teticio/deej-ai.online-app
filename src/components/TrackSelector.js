import React, { useState, useEffect } from 'react';
import { Text, TextInput, FaSpotify, Select, Option } from './Platform'
import { Row, Col, debounceFunction, HorizontalSpacer, VerticalSpacer } from './Lib';
import Search, { searchSimilar } from './Search';

export default function TrackSelector({ spotify = null, onSelect = f => f, onSearch = f => f, onSearchEnd = f => f }) {
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSearchSimilar = () => {
    onSearch();
    searchSimilar(currentTrack.url)
      .then(tracks => {
        if (tracks.length > 0) {
          onSelect(tracks[0].track_id);
        }
        onSearchEnd();
        setSearchResults(tracks);
      })
      .catch(error => {
        onSearchEnd();
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (spotify && spotify.loggedIn()) {
        spotify.autoRefresh(() => spotify.getMyCurrentPlayingTrack())
          .then(response => {
            if (response) {
              setCurrentTrack(response.item ? {
                'track':
                  `${response.item.artists[0].name} - ${response.item.name}`,
                'url': response.item.preview_url
              } : null);
            }
          }).catch(error => console.error('Error:', error));
      } else {
        setCurrentTrack(null);
      }
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => debounceFunction(() => {
    async function fetchSearchResults() {
      onSearch();
      if (searchString !== '') {
        const tracks = await Search(searchString);
        setSearchResults(tracks);
        onSelect((tracks.length > 0) ? tracks[0].id : null);
        return tracks;
      } else {
        setSearchResults([]);
        onSelect(null);
      }
      return [];
    }

    fetchSearchResults().then(results => {
      if (results.length > 0) {
        onSelect(results[0].track_id);
      }
      onSearchEnd();
    }).catch(error => {
      onSearchEnd();
      console.error('Error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 1000), [searchString]);

  return (
    <Col style={{flex: 1}}>
      <Row>
        {(currentTrack && currentTrack.url) ?
          <>
            <VerticalSpacer />
            <Row onClick={handleSearchSimilar}>
              <FaSpotify size='15' className='link' />
              <HorizontalSpacer />
              <Text h6 className='link'>{currentTrack.track}</Text>
            </Row>
          </> : <></>
        }
      </Row>
      <Row>
        <TextInput
          placeholder='Search...'
          onChange={event => setSearchString(event.target.value)}
          onChangeText={value => setSearchString(value)}
          style={{ width: '100%' }}
        />
      </Row>
      <Row>
        <VerticalSpacer />
      </Row>
      <Row>
        <VerticalSpacer />
        <Select
          selectedValue={selectedValue}
          onChange={event => onSelect(event.target.value)}
          onValueChange={value => { setSelectedValue(() => value); onSelect(value) }}
          style={{ width: '100%' }}
        >
          {searchResults.map(({ track_id, track }, i) => (
            <Option
              data-testid='track'
              key={i}
              label={track}
              value={track_id}
              style={{ width: '100%' }}
            />
          ))}
        </Select>
      </Row>
    </Col >
  );
}
