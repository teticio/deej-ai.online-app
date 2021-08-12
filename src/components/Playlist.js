import Track from "./Track";

export default function Playlist({ tracks = [], waypoints = [] }) {
  return (
    <>
      {tracks.map((track, i) => (
        <div className="d-flex flex-row align-items-center">
          <Track key={i} track={track} highlight={ waypoints.indexOf(track) >= 0 } />
        </div>
      ))}
    </>
  );
}
