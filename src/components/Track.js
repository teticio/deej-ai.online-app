import './Track.css';

export default function Track({ track_id, highlight = false }) {
  return (
    <iframe
      className={highlight ? "highlight" : ""}
      title={track_id}
      src={"https://open.spotify.com/embed/track/" + track_id}
      width="100%"
      height="80"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
}
