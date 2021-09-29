import React from 'react';
import RemovableTrack from './RemovableTrack';

export default function RemovablePlaylist({ track_ids = [], onRemove = f => f }) {
  return (
    <>
      {track_ids.map((track_id, i) => (
        <RemovableTrack
          key={i}
          track_id={track_id}
          uuid={i}
          onRemove={uuid => onRemove(uuid)}
        />
      ))}
    </>
  );
}
