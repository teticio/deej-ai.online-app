import { PureComponent, Suspense, useState } from 'react';
import { View, Spinner } from './Platform';
import VisibilitySensor from 'react-visibility-sensor';

try {
  require('./Track.css');
} catch (e) { }

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
    const { track_id, highlight, resource, testing } = this.props;
    const iframe = (resource) ? resource.read() : null;

    return (
      <VisibilitySensor offset={{ top: -5 * 80, bottom: -5 * 80 }}>
        {({ isVisible }) =>
          <iframe
            className={highlight ? 'highlight' : ''}
            title={track_id}
            // src={`https://open.spotify.com/embed/track/${track_id}`}
            srcdoc={(isVisible || testing) ? Buffer.from(iframe.data, 'base64') : ''}
            width='100%'
            height='80'
            frameBorder='0'
            allowtransparency='true'
            allow='encrypted-media'
          />
        }
      </VisibilitySensor>
    );
  }
}

export default function Track({
  track_id,
  highlight = false,
  testing = false
}) {
  if (typeof Track.cache == 'undefined') {
    Track.cache = {};
  }

  const [ resource, _ ] = useState((track_id in Track.cache) ? Track.cache[track_id] :
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
        highlight={highlight}
        resource={resource}
        testing={testing}
      />
    </Suspense>
  );
}
