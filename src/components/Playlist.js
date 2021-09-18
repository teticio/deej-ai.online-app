import React from 'react';
import { ScrollView } from './Platform';
import Track from './Track';

export default function Playlist({ track_ids = [], waypoints = [] }) {
  return (
    <ScrollView>
      {track_ids.map((track_id, i) => (
        <Track
          key={i}
          track_id={track_id}
          highlight={waypoints.indexOf(track_id) >= 0}
        />
      ))}
    </ScrollView>
  );
}
