import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Track.css';

function SpotifyTrackWidget({ track_id, highlight, loaded, onLoad = f => f }) {
  return (
    <iframe
      className={(loaded && highlight) ? "highlight" : ""}
      title={track_id}
      src={"https://open.spotify.com/embed/track/" + track_id}
      width={loaded ? "100%" : "0%"}
      height="80"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
      onLoad={() => onLoad()}
    />
  );
}

export default function Track({ track_id, highlight = false, onLoad = f => f }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ?
        <>
          <Spinner animation="border" />
          <SpotifyTrackWidget
            track_id={track_id}
            highlight={highlight}
            loaded={loaded}
            onLoad={() => {
              setLoaded(true);
              onLoad();
            }}
          />
        </> :
        <SpotifyTrackWidget
          track_id={track_id}
          highlight={highlight}
          loaded={loaded}
          onLoad={() => {
            setLoaded(true);
            onLoad();
          }}
        />
      }
    </>
  );
}
