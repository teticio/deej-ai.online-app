import { Suspense } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Track.css';

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

function SpotifyTrackWidget({ track_id, highlight, resource }) {
  const iframe = (resource) ? resource.read() : null;

  return (
    <iframe
      className={highlight ? "highlight" : ""}
      title={track_id}
      //src={`https://open.spotify.com/embed/track/${track_id}`}
      srcdoc={Buffer.from(iframe.data, 'base64')}
      width="100%"
      height="80"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
}

export default function Track({ track_id, highlight = false }) {
  if (typeof Track.cache == 'undefined') {
    Track.cache = {};
  }

  const resource = (track_id in Track.cache) ? Track.cache[track_id] :
    createResource(new Promise(resolves => {
      fetch(`${process.env.REACT_APP_API_URL}/widget?track_id=${track_id}`)
        .then(response => (response.status === 200) ? response.text() : '')
        .then(data => resolves({ data: data }))
        .catch(error => console.error('Error:', error));
    }));
  Track.cache[track_id] = resource;

  return (
    <Suspense fallback={
      <div
        className="d-flex justify-content-center align-items-center align-middle"
        style={{ height: 80, width: "100%" }}
      >
        <Spinner animation="border" />
      </div>
    } >
      <SpotifyTrackWidget
        track_id={track_id}
        highlight={highlight}
        resource={resource}
      />
    </Suspense>
  );
}
