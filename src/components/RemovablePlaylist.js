import RemovableTrack from "./RemovableTrack";

export default function RemovablePlaylist({ tracks = [], onRemove = f => f }) {
  return (
    <>
      {tracks.map((track, i) => (
        <div className="d-flex flex-row align-items-center">
          <RemovableTrack
            key={i}
            track={track}
            uuid={i}
            onRemove={(uuid) => onRemove(uuid)}
          />
        </div>
      ))}
    </>
  );
}
