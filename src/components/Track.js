import React, { PureComponent, Suspense, useState } from 'react';
import { View, Spinner, IFrame } from './Platform';

function createResource(pending) {
  let error, response;
  pending.then(r => response = r).catch(e => error = e);
  return {
    read() {
      if (error) throw error;
      if (response) return response;
      throw pending;
    }
  };
}

// Avoid unncessary re-renders
class SpotifyTrackWidget extends PureComponent {
  render() {
    const { track_id, resource } = this.props;
    const iframe = (resource) ? resource.read() : null;

    return (
      <IFrame
        title={track_id}
        width='100%'
        height={80}
        srcdoc={Buffer.from(iframe.data, 'base64').toString()}
      />
    );
  }
}

export default function Track({
  track_id
}) {
  if (typeof Track.cache == 'undefined') {
    Track.cache = {};
  }

  const [resource, ] = useState((track_id in Track.cache) ? Track.cache[track_id] :
    createResource(new Promise(resolves => {
      fetch(`${process.env.REACT_APP_API_URL}/widget?track_id=${track_id}`)
        .then(response => (response.status === 200) ? response.text() : '')
        .then(data => resolves({ data: data }))
        .catch(error => console.error('Error:', error));
    })));
  Track.cache[track_id] = resource;

  return (
    <Suspense fallback={
      <View
        style={{
          display: 'flex',
          height: 80,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Spinner animation='border' />
      </View>
    } >
      <SpotifyTrackWidget
        track_id={track_id}
        resource={resource}
      />
    </Suspense>
  );
}
