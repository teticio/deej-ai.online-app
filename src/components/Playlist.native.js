import React, { PureComponent, Suspense, useState } from 'react';
import { WebView, View, Spinner } from './Platform';

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
class SpotifyPlaylistWidget extends PureComponent {
  render() {
    const { resource, height } = this.props;
    const iframe = (resource) ? resource.read() : null;

    return (
      <WebView
        style={{
          flex: 0,
          height: height,
          backgroundColor: 'transparent'
        }}
        androidLayerType='software'
        source={{
          html: iframe? Buffer.from(iframe.data, 'base64').toString() : ''
        }}
      />
    );
  }
}

export default function Playlist({ track_ids = [], waypoints = [] }) {
  const height = 80 + 50 * track_ids.length;
  const [ resource, _ ] = useState(createResource(new Promise(resolves => {
    fetch(`${process.env.REACT_APP_API_URL}/playlist_widget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'track_ids': track_ids
      })
    })
      .then(response => (response.status === 200) ? response.text() : '')
      .then(data => resolves({ data: data }))
      .catch(error => console.error('Error:', error));
  })));

  return (
    <Suspense fallback={
      <View
        style={{
          display: 'flex',
          height: height,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Spinner size='large' />
      </View>
    } >
      <SpotifyPlaylistWidget
        resource={resource}
        height={height}
      />
    </Suspense>
  );
}

