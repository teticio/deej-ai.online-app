import Track from './Track';

export default function Playlist({ track_ids = [], waypoints = [] }) {
  return (
    <>
      {track_ids.map((track_id, i) => (
        <div className='d-flex flex-row justify-content-center align-items-center align-middle'>
          <Track
            key={i}
            track_id={track_id}
            highlight={waypoints.indexOf(track_id) >= 0}
          />
        </div>
      ))}
    </>
  );
}
