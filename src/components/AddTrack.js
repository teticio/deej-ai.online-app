import React, { useState } from 'react';
import { Card, Spinner, FaPlus } from './Platform';
import { Row, HorizontalSpacer } from './Lib';
import TrackSelector from './TrackSelector';

export default function AddTrack({ numTracks = 0, spotify = null, onAdd = f => f }) {
  const [currentId, setCurrentId] = useState(null);
  const [spinner, setSpinner] = useState(0);
  // eslint-disable-next-line
  const [searches, setSearches] = useState(0);

  return (
    <Card style={{ padding: 15 }}>
      <Row surface={true}>
        <TrackSelector
          spotify={spotify}
          onSelect={id => setCurrentId(id)}
          onSearch={() => {
            setSearches(searches => {
              if (searches + 1 !== 0) setSpinner(true);
              return searches + 1;
            });
          }}
          onSearchEnd={() => {
            setSearches(searches => {
              if (searches - 1 === 0) setSpinner(false);
              return searches - 1;
            });
          }}
        ></TrackSelector>
        <HorizontalSpacer />
        {spinner ?
          <Spinner
            animation='grow' size='md'
            onClick={() => {
              if (currentId && numTracks < 5) {
                onAdd(currentId);
              };
            }}
          /> :
          <FaPlus
            size='25'
            className={(currentId && numTracks < 5) ? 'link' : 'text-muted'}
            onClick={() => {
              if (currentId && numTracks < 5) {
                onAdd(currentId);
              };
            }}
          />
        }
      </Row>
    </Card>
  );
}
