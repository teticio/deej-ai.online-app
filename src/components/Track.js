import React from 'react';
import { IFrame } from './Platform';

export default function Track({ track_id }) {
  return (
    <IFrame
      title={track_id}
      width='100%'
      height={80}
      src={`${process.env.REACT_APP_API_URL}/widget` +
        `?track_id=${encodeURIComponent(track_id)}`
      }
    />
  );
}
