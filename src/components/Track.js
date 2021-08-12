import './Track.css';

export default function Track({ track, highlight = false }) {
  return (
    <iframe
      className={highlight ? "highlight" : ""}
      title={track}
      src={"https://open.spotify.com/embed/track/" + track}
      width="100%"
      height="80"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
}
