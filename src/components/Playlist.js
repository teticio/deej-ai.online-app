//import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { IFrame } from './Platform';

function loadWebCrypto() {
  import("expo-standard-web-crypto")
    .then(({ polyfillWebCrypto }) => {
      polyfillWebCrypto();
    })
    .catch(error => {
    });
}

loadWebCrypto();

export default function Playlist({ track_ids = [], waypoints = [], playlist_id = '' }) {
  const height = 80 + 50 * track_ids.length;

  return (
    <IFrame
      title={uuidv4()}
      width='100%'
      height={height}
      src={`${process.env.REACT_APP_API_URL}/playlist_widget` +
        `?track_ids=${encodeURIComponent(JSON.stringify(track_ids))}` +
        `&waypoints=${encodeURIComponent(JSON.stringify(waypoints))}` +
        `&playlist_id=${encodeURIComponent(playlist_id)}`
      }
    />
  );
}
