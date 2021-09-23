import React from 'react';
import { Text } from './Platform';
import { VerticalSpacer } from './Lib';
import Track from './Track';

export default function NotFound() {
  return (
    <>
      <Text h3 style={{ textAlign: 'center' }}>I still haven't found what you're looking for...</Text>
      <VerticalSpacer />
      <Track track_id='6wpGqhRvJGNNXwWlPmkMyO' />
    </>
  );
}
