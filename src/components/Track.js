import { useState, useRef, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Track.css';

function SpotifyTrackWidget({ track_id, highlight, loaded, onLoad = f => f }) {
  const ref = useRef();

  useEffect(() => {
    const iframe = ref.current.children[0];
    const listener = () => onLoad();

    iframe.addEventListener('load', listener);
    return () => iframe.removeEventListener('load', listener);
  }, [ref, onLoad]);

  return (
    <div dangerouslySetInnerHTML={{
      __html:
        `<iframe src="https://open.spotify.com/embed/track/${track_id}"
          class=${(loaded && highlight) ? "highlight" : ""}
          title=${track_id}
          width=${loaded ? "100%" : "0%"}
          height="80"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        />`
      }}
      ref={ref}
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
