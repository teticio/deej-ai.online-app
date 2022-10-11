import React, { useState } from 'react';
import { IFrame } from './Platform';

export default function Track({ track_id }) {
  const [visibility, setVisibility] = useState('hidden');

  return (
    <IFrame
      title={track_id}
      width='100%'
      onLoad={() => setVisibility('visible')}
      src={`${process.env.REACT_APP_API_URL}/track_widget` +
        `?track_id=${encodeURIComponent(track_id)}`
      }
    />
  );
}
